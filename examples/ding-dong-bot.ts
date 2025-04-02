/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import {
  EventLogoutPayload,
  EventLoginPayload,
  EventErrorPayload,
  EventMessagePayload,
}                         from 'wechaty-puppet'

import { PuppetDouyin } from '../src/mod'
import { config } from '../src/config'

/**
 * 1. 创建机器人实例
 */
const puppet = new PuppetDouyin({
  host: config.host,
  port: config.port,
})

/**
 * 2. 注册事件处理
 */
puppet
  .on('login',  onLogin)
  .on('logout', onLogout)
  .on('error',  onError)
  .on('message', onMessage)

/**
 * 3. 启动机器人
 */
puppet.start()
  .catch(async e => {
    console.error('Bot start() fail:', e)
    await puppet.stop()
    process.exit(-1)
  })

/**
 * 4. 事件处理函数
 */
function onLogin (payload: EventLoginPayload) {
  console.info(`${payload.contactId} 已连接`)
}

function onLogout (payload: EventLogoutPayload) {
  console.info(`${payload.contactId} 已断开`)
}

function onError (payload: EventErrorPayload) {
  console.error('Bot error:', payload.data)
}

/**
 * 5. 消息处理
 */
async function onMessage (payload: EventMessagePayload) {
  try {
    console.info('步骤1: 收到消息事件:', JSON.stringify(payload, null, 2));
    
    // 检查消息ID
    if (!payload.messageId) {
      console.error('步骤1失败: 消息ID为空，完整payload:', JSON.stringify(payload, null, 2));
      return;
    }
    console.info('步骤1成功: 消息ID有效');

    // 获取消息内容
    try {
      console.info('步骤2: 开始获取消息内容');
      const msgPayload = await puppet.messagePayload(payload.messageId);
      console.info('步骤2成功: 消息内容:', JSON.stringify(msgPayload, null, 2));

      // 检查消息内容
      if (!msgPayload || !msgPayload.text) {
        console.error('步骤2失败: 无效的消息内容，完整payload:', JSON.stringify(msgPayload, null, 2));
        return;
      }
      console.info('步骤2成功: 消息内容有效');

      const messageText = msgPayload.text.trim().toLowerCase();
      console.info('步骤3: 处理消息:', messageText);

      // 处理 ding 消息
      if (messageText === 'ding') {
        console.info('步骤4: 收到 ding 消息，准备回复 dong');
        try {
          // 获取发送者ID
          const senderId = msgPayload.fromId;
          console.info('步骤4.1: 发送者ID:', senderId);
          
          // 检查发送者ID是否有效
          if (!senderId) {
            console.error('步骤4.1失败: 发送者ID无效，无法发送消息');
            return;
          }
          console.info('步骤4.1成功: 发送者ID有效');
          
          // 发送消息
          console.info('步骤4.2: 开始发送 dong 消息');
          await puppet.messageSendText(senderId, 'dong');
          console.info('步骤4.2成功: 已发送 dong 消息');
          
          // 验证消息是否发送成功
          console.info('步骤4.3: 开始验证消息发送结果');
          const sentMsg = await puppet.messagePayload(payload.messageId);
          if (sentMsg && sentMsg.text === 'dong') {
            console.info('步骤4.3成功: 消息发送成功，已确认');
          } else {
            console.error('步骤4.3失败: 消息发送可能失败，未找到发送的消息');
          }
        } catch (e) {
          console.error('步骤4失败: 发送 dong 消息失败:', e);
          if (e instanceof Error) {
            console.error('错误堆栈:', e.stack);
          }
        }
      } else {
        console.info('步骤3: 收到其他消息:', messageText);
      }
    } catch (e) {
      console.error('步骤2失败: 获取消息内容失败:', e);
      if (e instanceof Error) {
        console.error('错误堆栈:', e.stack);
      }
    }
  } catch (e) {
    console.error('步骤1失败: 处理消息错误:', e);
    if (e instanceof Error) {
      console.error('错误堆栈:', e.stack);
    }
  }
}

/**
 * 6. 启动信息
 */
console.info(`
启动 Douyin Bot...
版本: ${puppet.version()}
配置: 
${JSON.stringify({
  host: (puppet as any).options.host || '默认',
  port: (puppet as any).options.port || '默认'
}, null, 2)}
`)

// 添加错误处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  if (err instanceof Error) {
    console.error('错误堆栈:', err.stack);
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('未处理的 Promise 拒绝:', reason);
  if (reason instanceof Error) {
    console.error('错误堆栈:', reason.stack);
  }
});