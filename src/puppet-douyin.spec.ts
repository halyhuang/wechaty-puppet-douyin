#!/usr/bin/env ts-node

import test  from 'blue-tape'

import { PuppetDouyin } from './puppet-douyin'

class PuppetMockTest extends PuppetDouyin {
}

test('PuppetMock perfect restart testing', async (t: any) => {
  const puppet = new PuppetMockTest()
  try {

    for (let i = 0; i < 3; i++) {
      await puppet.start()
      t.true(puppet.state.on(), 'should be turned on after start()')

      await puppet.stop()
      t.true(puppet.state.off(), 'should be turned off after stop()')

      t.pass('start/stop-ed at #' + i)
    }

    t.pass('PuppetMock() perfect restart pass.')
  } catch (e) {
    t.fail(e)
  }
})
