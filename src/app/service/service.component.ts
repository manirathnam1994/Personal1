import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceQuery } from '../model/service-query';
import { RequestResponseService } from '../requestresponse/req-res';
import { Toaster } from '../utils/toaster';
import { Constants } from '../utils/constants';
import { ScreenDropDown } from '../model/screen-dropdown';



@Component({
    selector: 'app-service',
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
    toasterResult: string;
    serviceForm: FormGroup;
    environment: string[];
    submitted = false;
    startServiceHide = false;
    stopServiceHide = false;
    TableHeaderHide = false;
    public serviceList: ServiceQuery[];
    serverList = [];
    started = false;
    startStopLoader = false;
    showToaster: string;
    valueaa: ServiceQuery;
    serviceController: string;
    num: number;
    scLoader = false;
    constructor(private fb: FormBuilder, private toaster: Toaster, private bs: RequestResponseService) {
        this.createForm();
    }
    // To make initial load
    ngOnInit() {
        this.toaster.closeNotification();
        this.startServiceHide = true;
        this.stopServiceHide = true;
        this.TableHeaderHide = true;
        // To display environment dropdown values in service screen
        this.environment = [];
        this.bs.getServiceEnvDropDown().subscribe((res: ScreenDropDown[]) => {
            for (const dropdown of res) {
                this.environment.push(dropdown.keys);
            }
        });
    }

    // To validate the input given by user.
    createForm() {
        this.serviceForm = this.fb.group({
            environment: ['', Validators.required],

        });
    }

    // To handle the control of form values
    get formValues() {
        return this.serviceForm.controls;
    }

    // To make a server call
    onSubmit() {
        let toasterResult: string;
        this.submitted = true;
        const environment = this.serviceForm.controls.environment.value;
        // stop here if form is invalid
        if (this.serviceForm.invalid) {
            toasterResult = '';
            if (environment === '' || environment === null) {
                const formResult = new Map([['Environment', environment]]);
                formResult.forEach((value, key) => {
                    if (value === '' || value == null) {
                        toasterResult += Constants.TOASTER_STAR + key + Constants.SPACE + Constants.TOASTER_APPEND_MSG + Constants.NXT_LINE_APPENDER;
                    }
                });
                this.startServiceHide = true;
                this.stopServiceHide = true;
                this.TableHeaderHide = true;
                return this.toaster.showError(toasterResult);

            } else {
                this.getServiceTableData(environment);
                this.startServiceHide = false;
                this.stopServiceHide = false;
                this.TableHeaderHide = false;
                this.toaster.closeNotification();
            }
        } else {
            this.getServiceTableData(environment);
            this.startServiceHide = false;
            this.stopServiceHide = false;
            this.TableHeaderHide = false;
            this.toaster.closeNotification();
        }
    }

    // To reset the screen
    reset() {
        this.serviceForm.reset();
        this.submitted = false;
        this.startServiceHide = true;
        this.stopServiceHide = true;
        this.TableHeaderHide = true;
        this.toaster.closeNotification();
    }

    // To fetch data from the server
    getServiceTableData(environment: string) {
        environment = environment.trim();
        this.submitted = true;
        this.serviceList = [];
        this.serverList = [];
        let serverName: string;
        this.bs.getServiceTableData(environment).subscribe((res: ServiceQuery[]) => {
            for (const output of res) {
                if (output.errorMsg != null && output.errorMsg != '') {
                    if (output.errorMsg === Constants.MODIFIED_ERROR) {
                        if (this.showToaster !== Constants.METHOD_CALL) {
                            return this.toaster.showInfoNotification(this.toasterResult);
                        }
                    } else {
                        if (this.showToaster !== Constants.METHOD_CALL) {
                            this.toasterResult = res[0].errorMsg;
                            this.toaster.showError(this.toasterResult);
                            break;
                        }
                    }
                } else {
                    this.serviceList.push(output);
                    if (this.serviceList.length === 0 || this.serviceList === null) {
                        this.startServiceHide = true;
                        this.stopServiceHide = true;
                        this.TableHeaderHide = true;
                    }

                    if ((this.serverList == null || this.serverList.length === 0)) {
                        serverName = output.server;
                        this.serverList.push(serverName);
                    }
                    let length = 0;
                    for (const sName of this.serverList) {
                        if (sName !== output.server) {
                            length++;
                            serverName = output.server;
                            if (length === this.serverList.length) {
                                if (serverName !== '') {
                                    this.serverList.push(serverName);
                                }
                            }
                        }
                    }
                }
            }

        });
    }
    // To start and stop the service.
    startStopService(value: ServiceQuery) {
        for (const service of this.serviceList) {
            if (value.command == Constants.SERVICE_CONTROLLER && service.status == Constants.RUNNING
                && service.server == value.server && service.command != Constants.SERVICE_CONTROLLER) {
                this.toasterResult = Constants.SERVICES_RUNNING
                return this.toaster.showError(this.toasterResult);
            }

            if (service.command == Constants.SERVICE_CONTROLLER && service.server == value.server && service.status == Constants.STOPPED
                && value.command != Constants.SERVICE_CONTROLLER) {
                this.toasterResult = Constants.START_SERVICE
                return this.toaster.showError(this.toasterResult);
            }
        }
        value.load = Constants.LOADING;
        const environment = this.serviceForm.controls.environment.value;
        this.startStopLoader = true;
        this.bs.startStopService(value, environment).subscribe((res: ServiceQuery[]) => {
            value.load = Constants.NOT_LOADING;
            if (res[0].errorMsg === null || res[0].errorMsg === '') {
                this.startStopLoader = false;
                if (value.status === Constants.STOPPED && res[0].status === Constants.RUNNING) {
                    this.serviceList.splice(this.serviceList.indexOf(value), 1, res[0]);
                }
                if (value.status === Constants.RUNNING && res[0].status === Constants.STOPPED) {
                    this.serviceList.splice(this.serviceList.indexOf(value), 1, res[0]);
                }
            } else if (res[0].errorMsg === Constants.MODIFIED_ERROR) {
                this.showToaster = Constants.METHOD_CALL;
                this.getServiceTableData(environment);
                this.toasterResult = res[0].errorMsg;
                return this.toaster.showError(this.toasterResult);
            } else if (res[0].errorMsg === Constants.JSON_FILE_EMPTY || res[0].errorMsg === Constants.SERVICELIST_JSON_EMPTY) {
                this.toasterResult = res[0].errorMsg;
                this.serviceList = [];
                return this.toaster.showError(this.toasterResult);
            } else {
                this.showToaster = Constants.METHOD_CALL;
                this.getServiceTableData(environment);
                this.toasterResult = res[0].errorMsg;
                return this.toaster.showError(this.toasterResult);
            }
        });

    }


}