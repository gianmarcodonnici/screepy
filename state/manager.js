var role_worker = require('role.worker');
var config = require('config');

function run_manager() {
    var core = Game.spawns['Core'];
    var room = core.room;

    //create list of creeps sorted by role
    var creep_list = _.groupBy(Game.creeps, (creep) => { return creep.memory.role; });
    //Spawn new worker if required and possible
    //TODO: Handle multiple spawns
    if (creep_list['worker'].length < config.constants.WORKER_SMALL_MAX
            && core.spawning = null
            && core.store[RESOURCE_ENERGY] >= 300) { //TODO: modify this to calc creep cost
        var name = "worker_" + Game.time;
        core.spawnCreep(config.creep_bodies['WORKER_SMALL'], name,
            {memory: {role: 'worker', task: config.tasks.IDLE}});
    }

    //Get idle workers and assign a task
    var idle_workers = _.filter( creep_list['worker'],
        (worker) => worker.memory.task == config.tasks.IDLE);

    if (idle_workers.length > 0) {
        //TODO: split up workers between tasks with estimates of work to do
        //skip all this if workers are all busy
        if (core.store[RESOURCE_ENERGY] < 300) {
            for ( var worker in idle_workers ) {
                role_worker.set_task(worker, config.tasks.CHARGE_SPAWN, core.id);
            }
        }
        else {
            //upgrade controller if spawn is charged
            for ( var worker in idle_workers ) {
                role_worker.set_task(worker, config.tasks.UPGRADE_CONTROLLER, room.controller.id);
            }
        }
    }

    //And finally, run creeps
    for (var worker in creep_list['worker'] ) {
        role_worker.run_worker(worker);
    }
}

module.exports = {
    run_manager
};

//
// What you're trying to do is highly inefficient: You iterate over the Game.creeps collection multiple times (I counted 8 times at least). If you wish to count creeps in roles I suggest you use
//
// var groups = _.groupBy(Game.creeps, (c) => { return c.memory.role; });
//
// This will return an object with each role as a key with behind the key a collection of all creeps in that specific role:
//
// {
//     harvester: [Creep, Creep, Creep],
//     builder: [Creep],
//     upgrader: [Creep, Creep, Creep]
// }
