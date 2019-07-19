// $Id:  $
// $Revision:  $
// $Date:  $

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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MQDepthComponent } from './mqdepth/mqdepth.component';
import { MQueueSetupComponent } from './setup/mqueue-setup/mqueue-setup.component';
import { ServerSetupComponent } from './setup/server-setup/server-setup.component';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { ServiceComponent } from './service/service.component';

const routes: Routes = [
    {
        path: 'mqdepthResult',
        component: MQDepthComponent
    },
    {
        path: 'mqdepthSetup',
        component: MQueueSetupComponent
    },
    {
        path: 'serverSetup',
        component: ServerSetupComponent
    },
    {
        path: 'dashboard',
        component: DashBoardComponent
    },
    {
        path: 'serviceScreen',
        component :  ServiceComponent

    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
