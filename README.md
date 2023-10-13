# LEOScope Web portal 
*This repository is part of an organization that is governed by multiple clauses. Details are [here](https://github.com/leoscope-testbed/.github)

- FAST BACKEND (FASTAPI Backend Implementation)
- FRONTEND (REACT/HTML/CSS) with AXIOS

This repository contains the implementational details of the Website hosted for LEOScope. The testbed elements and orchestrator implementations reside [here](https://github.com/leoscope-testbed/global-testbed)

## Architecture
![Website Architecture](https://github.com/leopard-testbed/global-testbed/blob/stage/extras/leoscope_arch.jpg?raw=true)

<!-- ![LEOScope Architecture](./extras/leoscope_arch.jpg) -->

The website has 3 major components:
* `Frontend` : Measurement entities consist of Measurement Clients and Measurement Servers, they are the end nodes where the experiments are deployed.
* `API` : Cloud Orchestrator or Orchestrator is responsible for handling the experiment schedule across nodes, updating the measurement nodes with the latest schedule and experiment information.
* `Backend` : Website (not included in this repository) or CLI is used by the end user to schedule, monitor, update and delete experiments on LEOScope and to download the results/logs, once the experiments are completed.

## Repository Structure

* `fast_backend\` : FASTAPI Backend Implementation of endpoints that receive communication from the frontend, verifies its validity and relays the requests to the cloud orchestrator or the database.
* `frontend\`: REACTJs implemenatation of the frontend pages that the user uses to interact with the testbed. Axios library used to make HTTPS requests to the backend endpoints.


## Getting Started 

Relevant for LEOScope Website Developers/Maintainers

#### 1. Clone the website repository

1. `$ https://github.com/leopard-testbed/website.git`
2. `$ cd website`
3. `$ git submodule update --init --recursive
`
#### 2. Set up  your development environment for the backend (Install python virtualenv package)

1. `$ virtualenv venv`
2. `$ source venv/bin/activate`
3. `$ cd fast_backend`
4. `$ pip3 install -r requirements.txt`
5. `$ uvicorn main:app --ssl-keyfile=<path_to_certificate> --ssl-certfile=<path_to_certificate> --host=0.0.0.0`
6. To kill a previously running process on the port & restart the backend endpoints of FASTAPI : `$sudo lsof -t -i tcp:8000 | sudo xargs kill -9`

#### 2. Set up  your development environment for the frontend react app


1. `$ cd frontend` (Move into the frontend folder)
2. `$ sudo apt install npm nodejs` (Install NPM in your machine)
4. `$ npm install -g npm@6.14.4`
5. `$ npm cache clean --force`
6. Delete node_modules by `$ rm -rf node_modules` or delete it manually. Delete the package-lock.json file as well.
7. `$ sudo npm install`
8. `$ sudo npm start`

## You might face version issues in the above process, follow the below steps to possibly resolve them :
Use [NVM Manager](https://github.com/nvm-sh/nvm)
- `$ npm install -g npm@6.14.4`
- `nvm install v20.2.0`
- Check version using `node -v`
- `sudo npm cache clean --force`
- `rm -rf node_modules/`
- `rm package-lock.json`
- `sudo npm install`
- `sudo npm start`


#### 3. Testing

1. This should set-up your website and host it on the machine's public IP.
2. Open the server IP using any browser, Login with your credentials and start using the testbed.

#### Certificates
The certs folder needs to be updated with authenticated certificates which can be generated using a trusted authority or be self signed for non-production purposes. For eg : `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365`
   
## Disclaimer 
A deployed testbed with this version of the code collects information like IP address, geolocation, and satellite terminal generated telemetry data from the measurement client nodes. Please use the code responsibly with proper EULA terms and ensure you have performed your own security and privacy measures. We are still working on a feature which will allow users to choose to let the orchestrator collect satellite terminal generated telemetry data from the measurement clients.

## Others
- Currently, the SSL Certficates are self-signed and will show a security risk error. You can click on Advanced and Proceed for development right now. In the productional environment, these will be changed to valid certificates.
- Similarly, to use other features of the testbed at the moment, the backend certificates also need to be allowed as trusted, hence go to "<Server_IP:8000/login>" on your proceed and select proceed with risks. For Eg "https://x.y.z.w":8000/login"

The testbed code is stable but work-in-progress still, with new features to come up in the future. Open-source contributions are welcome. Please get in touch with the maintainers specified in MAINTAINERS.md to contribute to this repository

## Initial Developers.

Below we list the initial developers of the testbed. Maintainer names are omitted for brevity.

| **NAME**           | **Email ID** |
|--------------------|--------------|
| Aryan Taneja       |t-arytaneja@microsoft.com             |
|                    |aryan19027@iiitd.ac.in           |
| Shubham Tiwari     |shubhamtiwaribits@gmail.com               |
|                    | tshubham@cs.washington.edu
| Saksham Bhushan    |t-sbhushan@microsoft.com             |
| Vinod Khandkar     |v.khandkar@surrey.ac.uk             |
| Abdullahi Abubakar |a.abubakar@surrey.ac.uk             |
| Roger Zhang        |yz02055@surrey.ac.uk             |
