'use srict'

const tap = require('tap')
const levelup = require('levelup')
const memdown = require('memdown')

const stopFn = () => {
  console.log('test/queue.js ->', 'stopping')
}

const runner = (id, params, cb) => {
  return {
    id: id,
    params: params
  }
}

const wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

// the test subject
const Queue = require('../queue.js')

const task1 = {
  commit: 'abcdef',
  clinic: 'off',
  remote: true
}
const task2 = {
  commit: '12345',
  clinic: 'on',
  remote: true
}
const task3 = {
  commit: '987654',
  clinic: 'on',
  remote: true
}

tap.test('add to queue', async (t) => {
  const db = levelup(memdown())
  let q = new Queue(stopFn, runner, db)
  let taskOne = q.add(task1)
  tap.equal(taskOne.commit, task1.commit, 'compare task1.commit')
  let taskTwo = q.add(task2)
  tap.equal(taskTwo.commit, task2.commit, 'compare task2.commit')
  t.end()
})

tap.test('get queue list', async (t) => {
  const db = levelup(memdown())
  let q = new Queue(stopFn, runner, db)
  let taskOne = q.add(task1)
  let taskTwo = q.add(task2)
  let status = q.getStatus()
  tap.equal(Object.entries(status).length, 2, 'check queue length')
  tap.equal(status[taskOne.id].work.commit, task1.commit, 'compare task1 on list')
  tap.equal(status[taskTwo.id].work.commit, task2.commit, 'compare task2 on list')
  t.end()
})

tap.test('check started', async (t) => {
  const db = levelup(memdown())
  const runner = async (params) => {
    await wait(500)
  }
  let q = new Queue(stopFn, runner, db)
  let taskOne = q.add(task1)
  let statusOne = q.getStatus()
  tap.equal(statusOne[taskOne.id].status, 'pending', 'task1 pending')
  await wait(300)
  let statusTwo = q.getStatus()
  tap.equal(statusTwo[taskOne.id].status, 'started', 'task1 started')
  await wait(500)
  let statusThree = q.getStatus()
  tap.equal(Object.keys(statusThree).length, 0, 'empty task list')
  t.end()
})

tap.test('drain queue', async (t) => {
  const db = levelup(memdown())
  const runner = async (params) => {
    await wait(500)
  }
  let q = new Queue(stopFn, runner, db)
  let taskOne = q.add(task1)
  let taskTwo = q.add(task2)
  let taskThree = q.add(task3)
  let status = q.getStatus()
  tap.equal(Object.entries(status).length, 3, 'check queue length')
  await wait(200)
  let newStatus = await q.drain()
  tap.equal(Object.keys(newStatus).length, 1, 'empty task list')
  t.end()
})

tap.test('schedule restart', async (t) => {
  const db = levelup(memdown())
  let q = new Queue(stopFn, runner, db)
  const restartTask = { restart: true }
  let taskOne = q.add(task1)
  let taskTwo = q.add(restartTask)
  let status = q.getStatus()
  tap.equal(Object.entries(status).length, 2, 'check queue length')
  tap.equal(status[taskOne.id].work.commit, task1.commit, 'compare task1 on list')
  tap.equal(status[taskTwo.id].work.restart, true, 'compare restart task in list')
  t.end()
})
