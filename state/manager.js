
var role_worker = require('worker');
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
           {memory: {role: 'worker', task: config.tasks.IDLE}});
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
    run_manager,
}

