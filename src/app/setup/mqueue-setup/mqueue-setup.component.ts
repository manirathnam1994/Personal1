import { Component, OnInit } from '@angular/core';
import { RequestResponseService } from '../../requestresponse/req-res';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScreenDropDown } from '../../model/screen-dropdown';
import { MQDepthSetupDetails } from '../../model/mqdepth-setup';
import { Toaster } from '../../utils/toaster';
import { Constants } from '../../utils/constants';
import { UtilServices } from '../../utils/utilSevices';

@Component({
    selector: 'app-mqueue-setup',
    templateUrl: './mqueue-setup.component.html',
    styleUrls: ['./mqueue-setup.component.css']
})

export class MQueueSetupComponent implements OnInit {

    mqSetupForm: FormGroup;
    servers: string[];
    toasterResult: string;
    public data: MQDepthSetupDetails[];
    submitted = false;
    formValueSno: number;
    updateFormValue = {};
    updateFunction = false;
    prevValues = {};
    environment: string;
    server: string;
    queueManager: string;
    queueList: string;
    prevEnv: string;
    editIconHide = false;
    deleteIconHide = false;

    constructor(private bs: RequestResponseService, private fb: FormBuilder, private toaster: Toaster, private utilServices: UtilServices) {
        this.createForm();
    }

    // To make initial load
    ngOnInit(): void {
        // To close the error notification if any toaster present
        this.toaster.closeNotification();
        // To display server dropdown values
        this.servers = [];
        this.bs.getServerDropDown().subscribe((res: ScreenDropDown[]) => {
            for (const dropdown of res) {
                this.servers.push(dropdown.keys);
            }
        });

        // To display MQ Setup table data
        this.data = [];
        this.bs.getMQDepth().subscribe((res: MQDepthSetupDetails[]) => {
            if (res[0].message === Constants.SUCCESS_MSG) {
                for (const output of res) {
                    this.data.push(output);
                }
            } else if (res[0].message === Constants.READ_MQDEPTH_EMPTY_MSG) {
                this.data = [];
            } else if (res[0].message !== null || res[0].message !== '') {
                this.toasterResult = res[0].message;
                return this.toaster.showError(this.toasterResult);
            }
        });
    }

    createForm() {
        this.mqSetupForm = this.fb.group({
            server: ['', Validators.required],
            env: ['', Validators.required],
            queMgr: ['', Validators.required],
            queueList: ['', Validators.required]
        });
    }

    get formValues() {
        return this.mqSetupForm.controls;
    }

    onSubmit() {
        this.submitted = true;
    }

    // To write MQ setup details in json file
    writeMQSetup(env: string, server: string, qMgr: string, qList: string) {

        env = env.trim();
        server = server.trim();
        qMgr = qMgr.trim();
        qList = qList.trim();
        //this.toasterResult = '';

        this.bs.writeMQSetup(env, server, qMgr, qList).subscribe((res: MQDepthSetupDetails[]) => {
            if (res[0].message === Constants.SUCCESS_MSG) {
                this.data = [];
                this.reset();
                let sucecssMsg = Constants.INSERT_SUCCESS_MSG;
                for (const output of res) {
                    this.data.push(output);
                }

                this.toasterResult = sucecssMsg;
                return this.toaster.showSucccessNotification(this.toasterResult);
            } else if (res[0].message !== null || res[0].message !== '') {
                this.toasterResult = res[0].message;
                return this.toaster.showError(this.toasterResult);
            }
        });
    }

    // To reset the form
    reset() {
        this.mqSetupForm.reset();
        this.submitted = false;
        this.toaster.closeNotification();
    }

    // To edit list values
    displayMQSetupDataForEdit(values) {
        //To hide edit & delete icon on edit operation
        this.editIconHide = true;
        this.deleteIconHide = true;
        this.utilServices.showButton(Constants.UPDATE);
        let formValue = {};
        formValue = values;
        this.prevValues = values;
        this.formValueSno = values.sno;
        this.mqSetupForm.patchValue(formValue);
    }

    // To update the list values
    updateMQSetupData(sno: number) {
        //To show edit & delete icon after save operation
        this.editIconHide = false;
        this.deleteIconHide = false;
        const environment = this.mqSetupForm.value.env;
        this.environment = environment.toString();
        this.server = this.mqSetupForm.value.server;
        this.queueManager = this.mqSetupForm.value.queMgr;
        this.queueList = this.mqSetupForm.value.queueList;
        this.environment = this.environment.trim();
        this.server = this.server.trim();
        this.queueManager = this.queueManager.trim();
        this.queueList = this.queueList.trim();
        if (this.mqSetupForm.invalid) {
            this.toasterResult = '';
            const formResult = new Map([['Environment', this.mqSetupForm.value.env], ['Server', this.mqSetupForm.value.server], ['QueueManager', this.mqSetupForm.value.queMgr], ['QueueList', this.mqSetupForm.value.queueList]]);
            formResult.forEach((value, key) => {
                if (value === '' || value === null) {
                    this.toasterResult += Constants.TOASTER_STAR + key + Constants.SPACE + Constants.TOASTER_APPEND_MSG + Constants.NXT_LINE_APPENDER;
                }
            });
            return this.toaster.showError(this.toasterResult);
        } else {

            this.bs.editMqDepth(sno, this.environment, this.server, this.queueManager
                , this.queueList, this.prevValues).subscribe((res: MQDepthSetupDetails[]) => {
                    if (res[0].message === Constants.SUCCESS_MSG) {
                        this.data = [];
                        this.reset();
                        for (const output of res) {
                            this.data.push(output);
                        }
                        this.utilServices.showButton(Constants.ADD);
                        this.toasterResult = Constants.UPDATE_SUCCESS_MSG;
                        return this.toaster.showSucccessNotification(this.toasterResult);
                    } else if (res[0].message === Constants.MODIFIED_ERR) {
                        this.data = [];
                        this.reset();
                        for (const output of res) {
                            this.data.push(output);
                        }
                        this.utilServices.showButton(Constants.ADD);
                        this.toasterResult = Constants.MODIFIED_ERR;
                        return this.toaster.showInfoNotification(this.toasterResult);

                    } else if (res[0].message !== null || res[0].message !== '') {
                        this.utilServices.showButton(Constants.UPDATE);
                        this.toasterResult = res[0].message;
                        return this.toaster.showError(this.toasterResult);
                    }
                });
        }
    }

    // To delete the list values
    onDelete(data: any, sno: number, env: string, server: string, qManager: string, qList: string) {
        let len = data.length
        let envDel = env.toString();
        if (confirm(Constants.DELETE_CNF_MSG) === true) {
            this.bs.deleteMqDepth(data, len, sno, env).subscribe((res: MQDepthSetupDetails[]) => {
                if (res[0].message === Constants.SUCCESS_MSG) {
                    this.data = [];
                    //let serverDel = env.toString();
                    let deleteSuccessMsg = Constants.OPEN_BRACKET + envDel + Constants.CLOSE_BRACKET
                        + Constants.SPACE + Constants.DELETE_SUCCESS
                    for (const output of res) {
                        this.data.push(output);
                    }
                    this.toasterResult = deleteSuccessMsg;
                    return this.toaster.showSucccessNotification(this.toasterResult);
                }
                else if (res[0].message === Constants.READ_MQDEPTH_EMPTY_MSG) {
                    this.data = [];
                }
                else if (res[0].message === Constants.MODIFIED_ERR) {
                    this.data = [];
                    this.reset();
                    for (const output of res) {
                        this.data.push(output);
                    }
                    this.toasterResult = Constants.MODIFIED_ERR;
                    return this.toaster.showInfoNotification(this.toasterResult);
                }
                else if (res[0].message === envDel + Constants.MODIFIED_ERR) {
                    this.data = [];
                    this.reset();
                    for (const output of res) {
                        this.data.push(output);
                    }
                    this.toasterResult = Constants.OPEN_BRACKET + envDel + Constants.CLOSE_BRACKET
                        + Constants.SPACE + Constants.MODIFIED_ERR;
                    return this.toaster.showInfoNotification(this.toasterResult);
                }
                else if (res[0].message !== null || res[0].message !== '') {
                    this.toasterResult = res[0].message;
                    return this.toaster.showError(this.toasterResult);
                }
            });

        }
    }

    // To show notification when the value is selected in dropdown
    onSelect(val: string) {
        if (val.length > 0) {
            this.toaster.showInfoNotification(Constants.DROPDOWN_SERVER_NOTIFICATION);
        }
        if (this.servers.length === 0) {
            this.toaster.showInfoNotification(Constants.ADD_SERVER_MSG);
        }
    }

    // To write Server setup date
    addMQSetupData() {
        this.toasterResult = '';

        const env = this.mqSetupForm.controls.env.value;
        const server = this.mqSetupForm.controls.server.value;
        const qMgr = this.mqSetupForm.controls.queMgr.value;
        const qList = this.mqSetupForm.controls.queueList.value;

        if (this.mqSetupForm.invalid) {
            this.toasterResult = '';
            const formResult = new Map([['Environment', env], ['Server', server], ['QueueManager', qMgr], ['QueueList', qList]]);
            formResult.forEach((value, key) => {
                if (value === '' || value === null) {
                    this.toasterResult += Constants.TOASTER_STAR + key + Constants.SPACE
                        + Constants.TOASTER_APPEND_MSG + Constants.NXT_LINE_APPENDER;
                }
            });
            return this.toaster.showError(this.toasterResult);
        } else {
            this.writeMQSetup(env, server, qMgr, qList);
            return this.toaster.closeNotification();
        }
    }

    // To handle on click cancel button
    cancel() {
        //To show edit & delete icon on cancel operation
        this.editIconHide = false;
        this.deleteIconHide = false;
        this.utilServices.showButton(Constants.ADD);
        this.reset();
    }

    // To show empty server dropdown alert
    showEmptyServerAlert() {
        if (this.servers.length === 0) {
            this.toaster.showInfoNotification(Constants.ADD_SERVER_MSG);
        }
    }
}
