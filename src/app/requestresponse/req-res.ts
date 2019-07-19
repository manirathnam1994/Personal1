//$Id:  $
//$Revision:  $
//$Date:  $

/*
 * +=======================================================================+
 * |                                                                       |
 * |          Copyright (C) 2018-2019 Nomura Securities Co., Ltd.          |
 * |                          All Rights Reserved                          |
 * |                                                                       |
 * |    This document is the sole property of Nomura Securities Co.,       |
 * |    Ltd. No part of this document may be reproduced in any form or     |
 * |    by any means - electronic, mechanical, photocopying, recording     |
 * |    or otherwise - without the prior written permission of Nomura      |
 * |    Securities Co., Ltd.                                               |
 * |                                                                       |
 * |    Unless required by applicable law or agreed to in writing,         |
 * |    software distributed under the License is distributed on an        |
 * |    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,       |
 * |    either express or implied.                                         |
 * |                                                                       |
 * +=======================================================================+
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MQDepthQueryDetails } from '../model/mqdepth-query-res';
import { ScreenDropDown } from '../model/screen-dropdown';
import { MQDepthSetupDetails } from '../model/mqdepth-setup';
import { ServerSetupDetails } from '../model/server-setup';
import { ServiceQuery } from '../model/service-query';

@Injectable({
    providedIn: 'root'
})

export class RequestResponseService {
    options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private http: HttpClient) {
    }

    // To get grid values of MQ Depth query screen
    getGridData(queue: string, environment: string, enableQ: boolean): Observable<MQDepthQueryDetails[]> {

        const obj = {
            'queue': queue,
            'environment': environment,
            'showAllQueue': enableQ
        };
        return this
            .http
            .post<MQDepthQueryDetails[]>(`/api/getMQDepthDetails`, JSON.stringify(obj), this.options);
    }

    // To get dropdown values of environment
    getEnvDropDown(): Observable<ScreenDropDown[]> {
        return this
            .http
            .post<ScreenDropDown[]>(`/api/getEnvDropdownData`, this.options);
    }

    // To get dropdown values of server
    getServerDropDown(): Observable<ScreenDropDown[]> {
        return this
            .http
            .post<ScreenDropDown[]>(`/api/getServerDropdownData`, this.options);
    }

    // To write server details in json file
    writeServerSetup(server: string, host: string, uName: string, pwd: string, sPath: string): Observable<ServerSetupDetails[]> {

        const obj = {
            'server': server,
            'host': host,
            'userName': uName,
            'password': pwd,
            'scriptPath': sPath
        };
        return this
            .http
            .post<ServerSetupDetails[]>(`/api/writeServerSetupDetails`, obj, this.options);
    }

    // To write MQ Depth details in json file
    writeMQSetup(env: string, server: string, qMgr: string, qList: string): Observable<MQDepthSetupDetails[]> {
        const obj = {
            'environment': env,
            'server': server,
            'queueManager': qMgr,
            'queueList': qList,
        };
        return this
            .http
            .post<MQDepthSetupDetails[]>(`/api/writeMQDepthSetupDetails`, obj, this.options);
    }

    // To get MQ depth details
    getMQDepth(): Observable<MQDepthSetupDetails[]> {
        return this
            .http
            .post<MQDepthSetupDetails[]>(`/api/getMQSetupTableData`, this.options);
    }

    // To get Server details
    getServer(): Observable<ServerSetupDetails[]> {
        return this
            .http
            .post<ServerSetupDetails[]>(`/api/getServerSetupTableData`, this.options);
    }

    // To Delete Server details
    deleteServer(len: number, sno: number, server: string, data: any): Observable<ServerSetupDetails[]> {
        const obj = {

            'server': server,
            'sno': sno,
            'tableLength': len,
            'tableData': data


        };
        return this
            .http
            .post<ServerSetupDetails[]>(`/api/deleteServerSetupData`, obj, this.options);
    }

    deleteServerMQCheck(len: number, sno: number, server: string, data: any): Observable<ServerSetupDetails[]> {
        const obj = {

            'server': server,
            'sno': sno,
            'tableLength': len,
            'tableData': data


        };
        return this
            .http
            .post<ServerSetupDetails[]>(`/api/deleteServerMQCheck`, obj, this.options);
    }

    // To update the Server Details
    editServer(sno: number, server: string, host: string, username: string, password: string, scriptpath: string, prevValues: any): Observable<ServerSetupDetails[]> {
        const obj = {
            'sno': sno,
            'server': server,
            'host': host,
            'userName': username,
            'password': password,
            'scriptPath': scriptpath,
            'editableValue': prevValues
        };
        return this
            .http
            .post<ServerSetupDetails[]>(`/api/updateServerSetupData`, obj, this.options);
    }

    deleteMqDepth(data: any, len: number, sno: number, env: string): Observable<MQDepthSetupDetails[]> {
        const obj = {
            'sno': sno,
            'environment': env,
            'tableLength': len,
            'data': data,

        };
        return this
            .http
            .post<MQDepthSetupDetails[]>(`/api/deleteMQSetupData`, obj, this.options);
    }

    editMqDepth(sno: number, env: string, server: string, queMgr: string, queueList: string, prevValues: any): Observable<MQDepthSetupDetails[]> {
        const obj = {
            'sno': sno,
            'environment': env,
            'server': server,
            'queueManager': queMgr,
            'queueList': queueList,
            'editableValue': prevValues
        };
        return this
            .http
            .post<MQDepthSetupDetails[]>(`/api/updateMQSetupData`, obj, this.options);
    }

    // To check Server data in MQ Setup for updating server setup data
    editServerMQCheck(values: any): Observable<ServerSetupDetails[]> {
        const obj = {
            'server': values.server,

        };
        return this
            .http
            .post<ServerSetupDetails[]>(`/api/editServerMQCheckList`, obj, this.options);
    }

    // To get dropdown values of environment in service screen
    getServiceEnvDropDown(): Observable<ScreenDropDown[]> {
        return this
            .http
            .post<ScreenDropDown[]>(`/api/getServiceEnvDropdownData`, this.options);
    }


    // To get service commands in service screen
    getServiceTableData(environment: string): Observable<ServiceQuery[]> {
        const obj = {
            'environment': environment,
        };
        return this
            .http
            .post<ServiceQuery[]>(`/api/getServiceTableData`, obj, this.options);
    }

    // To start and stop service
    startStopService(value: ServiceQuery, environment: string): Observable<ServiceQuery[]> {
        const obj = {
            'serviceDetails': value,
            'environment': environment
        };
        return this
            .http
            .post<ServiceQuery[]>(`/api/startOrStopService`, obj, this.options);
    }





}
