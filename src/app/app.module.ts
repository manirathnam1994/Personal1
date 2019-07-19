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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateModule } from '@ngx-translate/core';

import { RequestResponseService } from './requestresponse/req-res';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationService } from './utils/pagination';
import { MQDepthComponent } from './mqdepth/mqdepth.component';
import { MQueueSetupComponent } from './setup/mqueue-setup/mqueue-setup.component';
import { ServerSetupComponent } from './setup/server-setup/server-setup.component';
import { DashBoardComponent} from './dashboard/dashboard.component';
import { Toaster } from './utils/toaster';
import { UtilServices } from './utils/utilSevices';
import { ServiceComponent } from './service/service.component';

@NgModule({
  declarations: [
    AppComponent,
    MQDepthComponent,
    HeaderComponent,
    FooterComponent,
    MQueueSetupComponent,
    ServerSetupComponent,
    DashBoardComponent,
    ServiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularSlickgridModule.forRoot(),
    TranslateModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [RequestResponseService, PaginationService, Toaster, UtilServices],
  bootstrap: [AppComponent]
})
export class AppModule { }

