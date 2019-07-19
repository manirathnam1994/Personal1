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

export class MQDepthQueryDetails {
    id: string;
    physicalQueueName: string;
    queueDepth: string;
    logicalQueueName: string;
    errorCode: string;
    error: string;
}
