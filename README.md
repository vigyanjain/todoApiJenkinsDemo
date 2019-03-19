# Jenkins Pipeline Demo

The TODO app here is a simple application which was taken from the [Medium](https://maximilianschmitt.me/posts/tutorial-rest-api-integration-testing-node-js/) post 
and modified somewhat.

## Todo
A simple todo application which does not do much

## Tests
integration tests to test the insert and read features of the endpoint

## Jenkinsfile
Defines the integration pipeline to use 

## How to use

### Create a Git repo
Either fork this repo to start (everything is free, use it as you wish), or create a new repo and use the `Jenkinsfile`
in this repo as a start.

### Setup Atlas Account
1. create an account (if you don't have one) on `https://cloud.mongodb.com`
1. create an organization
1. under access select `API key`
    1. create a new api key
    1. copy the private key and save it in a secure place as it will not be shown again
    1. add your IP or CIDR block to the IP whitelist to allow for 
1. create a project
    1. create a user that will access the database
    1. enable access through the ip whitelist
    
For a full list of configurations, please see the [Atlas Documentation](https://docs.atlas.mongodb.com/)

### Install & Configure Jenkins

[Install Jenkins](https://jenkins.io/doc/book/installing/) using your preferred method, install the following addons:
1. `Build Pipeline Plugin`
1. `CloudShell Sandbox Plugin`
1. `cross-platform shell plugin`
1. `docker plugin`
1. `GitHub Integration Plugin`
1. `Hashicorp Vault Pipeline Plugin`
1. `HTTP Request Plugin`
1. `Hudson Post build task`
1. `JIRA Pipeline Steps`
1. `Managed Scripts`
1. `Node and Label Parameter plugin`
1. `Pipeline GitHub Notify Step Plugin`
1. `Pipeline Maven Integration Plugin`
1. `Pipeline NPM Integration Plugin`
1. `Pipeline timeline`
1. `Pipeline: AWS Steps`
1. `Pipeline: GitHub`
1. `Pipeline: GitHub Groovy Libraries`
1. `Pipeline: Groovy`
1. `Pipeline: Multibranch with defaults`
1. `Safe Restart Plugin`
1. `Tool Environment plugin`

Not all the addons will be used during this demo, but will be used in future releases.

### Setup Atlas Credentials
1. Log into the console, select `Manage Jenkins`
1. Selct `Configure System` in the new window
1. Scroll down to `HTTP Request`
    1. add a new Basic/Digest Authentication
    1. give it a key name of `atlas`
    1. set username as public key from Atlas API key created above
    1. set password as the private key from Atlas API key created above


### Create Our Pipeline
1. Log into the console, select `New Item`
1. Give the pipeline a name, choose `Pipeline`, select `OK`
1. Optionally give your Pipeline a description
1. Optinally setup a rotation strategy
1. Select `GitHub project` and give it a url to the rep created above
1. Select this project has parameters, add the following parameters:
    1. clusterName: name of atlas cluster to deploy
    1. projectName: name of project to deploy cluster to
    1. userName: database user name to setup
    1. password: password of database user (password variable)
1. Select `Pipeline script from SCM` definition
1. Selct `Git` as SCM type
1. For Repository URL add your repository, make sure you have credentials setup as needed.
1. Set `Jenkinsfile` as the Script Path
1. Select Save

### Run the pipeline
Once the Pipeline is created, let's run it and see what happens.
1. from the dashboard, select the pipeline created above
1. select build with parameters, If defaults are filled in an good to go, select ok

As the project builds you will be able to view the console of the running process.
From here if everything works you will have deployed an atlas instance, ran a simple node app on the worker, tested
the application, and then destroyed the atlas instance.

## TODO
- configure docker 
- have worker deploy app to a docker container
- run tests from docker
- create a more meaningful application
- introduce Stitch
- introduce github triggers
