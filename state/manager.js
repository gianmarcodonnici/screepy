var role_worker = require('role.worker');
var config = require('config');

function run_manager() {
    var core = Game.spawns['Core'];
    var room = core.room;
    
    var workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
    if (workers.length < config.constants['WORKER_SMALL_MAX'] 
        && core.store[RESOURCE_ENERGY] == 300
        && core.spawning == null) {
        //spawn worker
        var name = 'Worker' + Game.time;
        console.log('Spawning new worker: ' + name);
        core.spawnCreep(config.creep_bodies['WORKER_SMALL'], name, 
           {memory: {role: 'worker', state: config.states.IDLE}});
    }

    //get workers full of energy
    var full_workers = _.filter(workers, 
        (creep) => creep.memory.state == config.states.FULL);

    //Check if spawn is filled up, send full workers if not
    if (core.store[RESOURCE_ENERGY] < 300) {
        //TODO: calculate number of workers needed to fill up the spawn
        for (var worker of full_workers) {
            worker.memory.state = config.states.MOVE;
            worker.memory.state_data = core.id;
            worker.memory.state_next = config.states.TRANSFER;
        }
    }
    else {
        //Send workers to upgrade controllers
        //TODO: maybe write something to reassign works?
        for (worker of full_workers) {
            worker.memory.state = config.states.MOVE;
            worker.memory.state_data = room.controller.id;
            worker.memory.state_next = config.states.UPGRADE;
        }
    }
    //Run workers
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'worker') {
            role_worker.run_worker(creep);
        }
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
