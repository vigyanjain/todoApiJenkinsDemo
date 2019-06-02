/*
 * simple deployment script using Atlas API
 * https://docs.atlas.mongodb.com/api/
 */
import groovy.json.JsonSlurper

def projectId = -1
def url = "https://cloud.mongodb.com/api/atlas/v1.0"
def clusterUrl = ""
def connectionString = ""

pipeline {
    agent any

    stages{
        stage("getProject") {
            steps {
                script{
                    def resp = httpRequest httpMode: "GET",
                        url: url + "/groups",
                        authentication: "atlas"

                    def j = new JsonSlurper().parseText(resp.content)
                    j["results"].each {
                        if ( it.name == projectName ){
                            projectId = it.id
                        }
                    }
                    /*
                    * silly hack:
                    * - json is not serializable inside of jenkins
                    * - unset the variable is easiest
                    */
                    j = ""
                }
            }
        }

        stage("buildDatabase") {
            steps {
                script {
                    def stillBuilding = true
                    if ( projectId == -1 ) {
                        error "project id was not set successfully"
                    }
                    /*
                    * most basic deployment configuration
                    * https://docs.atlas.mongodb.com/reference/api/clusters-create-one/
                    */
                    def clusterConfig = """{
                        \"name\" : \"""" + clusterName + """\",
                        \"providerSettings\" : {
                            \"providerName\" : \"AWS\",
                            \"instanceSizeName\" : \"M10\",
                            \"regionName\" : \"AP_SOUTHEAST_2\"
                        }
                    }"""

                    resp = httpRequest httpMode: "POST",
                        contentType: "APPLICATION_JSON",
                        authentication: "atlas",
                        url: url + "/groups/" + projectId + "/clusters",
                        requestBody: clusterConfig

                    def j = new JsonSlurper().parseText(resp.content)
                    j["links"].each {
                        if ( it.rel == "self"){
                            clusterUrl = it.href
                        }
                    }

                    if( j["stateName"] == "CREATING"){
                        println("Creating cluster: will sleep for 40 seconds")
                        //unset json before sleeping, json is not serializable
                        j = ""
                        sleep 40
                    }

                    //check clusterUrl if == ""//
                    while(stillBuilding) {
                        resp = httpRequest httpMode: "GET",
                            url: clusterUrl,
                            authentication: "atlas"
                        j = new JsonSlurper().parseText(resp.content)
                        if ( !(j["stateName"] == "CREATING") ){
                            stillBuilding = false
                            connectionString = j["srvAddress"]
                            connectionString = connectionString.split "//"
                            connectionString = connectionString[0] + "//" + userName + ":" + password + "@" + connectionString[1]
                            j = ""
                        } else {
                            println j["stateName"] + "(" + resp.status + "): sleeping 40 seconds"

                            //unset json before sleeping, json is not serializable
                            j = ""
                            sleep 40
                        }
                    }
                }
            }
        }

        stage("seedDatabase"){
            steps {
                echo "nothing to seed as tests will drop collection and test insert"
                echo "using $connectionString to connect to the database"

            }
        }
        stage("buildJsApp") {
            steps {
                echo "build js app (using current workspace)"
                sh "touch ./.env"
                sh "echo PORT=4000 > ./.env"
                sh "echo MURI=$connectionString >> ./.env"
                sh "echo MDB=demo >> ./.env"
                sh "npm install"
            }
        }
        stage("testJsApp") {
            steps {
                sh "npm test"
            }
        }
        stage("destroyApp") {
            steps {
                echo "nothing to destroy at this time"
            }
        }

        stage("destroyDb") {
            steps {
                script {
                    def deleting = true
                    resp = httpRequest httpMode: "DELETE",
                        url: clusterUrl,
                        authentication: "atlas"
                    println(resp.status)

                    while(deleting) {
                        resp = httpRequest httpMode: "GET",
                            url: clusterUrl,
                            authentication: "atlas",
                            validResponseCodes: '200,404'
                        j = new JsonSlurper().parseText(resp.content)
                        if ( !(j["stateName"] == "DELETING") || resp.status == 404 ){
                            j = ""
                            deleting = false
                        } else {
                            print(j["stateName"] + "(" + resp.status + "): sleeping 10 seconds")
                            //unset json before sleeping, json is not serializable
                            j = ""
                            sleep 10
                        }
                    }
                    println("successfully destroyed atlas database")
                }
            }
        }
    }
}
