var config = require('config');
//TODO: handle ERR_FULL on spawn

function set_state(creep, state, target) {
    creep.memory.state = state;
    creep.memory.state_data = target;
}

function set_task(creep, task, task_data) {
    creep.memory.task = task
    creep.memory.task_data = task_data;
    creep.memory.state = config.states.IDLE;
    creep.memory.state_data = null;
}

function set_idle(creep) {
    creep.set_task(creep, config.tasks.IDLE, null);
}

function get_source(creep) {
    //TODO: handle multiple sources
    return creep.room.find(FIND_SOURCES_ACTIVE)[0]
}

//AI functions
function task_idle(creep) {
    //Do nothing for now
}

function task_charge_spawn(creep) {
    switch (creep.memory.state) {
        case config.states.IDLE:
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                set_state(creep, config.states.MOVE, get_source(creep).id);
            }
            else {
                set_state(creep, config.states.MOVE, creep.memory.task_data);
            }
            break;
        case config.states.MOVE:
            var move_target = Game.getObjectById(creep.memory.state_data);
            creep.moveTo(move_target);
            if (creep.pos.isNearTo(move_target) == true) {
                //if target is a spawn, charge it, else harvest energy;
                if (creep.memory.task_data == move_target.id) {
                    set_state(creep, config.states.TRANSFER, creep.memory.state_data);
                }
                else { //if it's not a spawn it's a source
                    set_state(creep, config.states.HARVEST, creep.memory.state_data);
                }
            }
            break;
        case config.states.HARVEST:
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                creep.harvest(Game.getObjectById(creep.memory.state_data));
            }
            else {
                //creep is full, move to spawn
                set_state(creep, config.states.MOVE, creep.memory.task_data);
            }
            break;
        case config.states.TRANSFER:
            if (creep.store[RESOURCE_ENERGY] > 0) {
                //creep still has energy, transfer it to the spawns
                var spawn = Game.getObjectById(creep.memory.task_data);
                var result = creep.transfer(spawn, RESOURCE_ENERGY);
                //go idle if spawn is full
                if (result == ERR_FULL) {
                    set_idle(creep);
                }
            }
            break;
    }
}

function task_upgrade_controller(creep) {
    switch(creep.memory.state) {
        //TODO: code duplication here
        case config.states.IDLE:
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                set_state(creep, config.states.MOVE, get_source(creep).id);
            }
            else {
                set_state(creep, config.states.MOVE, creep.memory.task_data);
            }
            break;
        case config.states.MOVE:
            var move_target = Game.getObjectById(creep.memory.state_data);
            creep.moveTo(move_target);
            if (creep.pos.isNearTo(move_target) == true) {
                //if target is a spawn, charge it, else harvest energy;
                if (creep.memory.task_data == move_target.id) {
                    set_state(creep, config.states.UPGRADE, creep.memory.state_data);
                }
                else { //if it's not a spawn it's a source
                    set_state(creep, config.states.HARVEST, creep.memory.state_data);
                }
            }
            break;
        case config.states.HARVEST:
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                creep.harvest(Game.getObjectById(creep.memory.state_data));
            }
            else {
                //creep is full, move to controller
                set_state(creep, config.states.MOVE, creep.memory.task_data);
            }
            break;
        case config.states.UPGRADE:
            if (creep.store[RESOURCE_ENERGY] > 0) {
                //creep still has energy, transfer it to the spawns
                var controller = Game.getObjectById(creep.memory.task_data);
                creep.upgradeController(controller);
            }
            break;
    }
}


var role_worker = {

    /** @param {Creep} creep **/
    run_worker: function(creep) {
        switch (creep.memory.task) {
            case config.tasks.IDLE:
                task_idle(creep);
                break;
            case config.tasks.CHARGE_SPAWN:
                task_charge_spawn(creep);
                break;
            case config.tasks.UPGRADE_CONTROLLER:
                task_upgrade_controller(creep);
                break;
        }
    }
};

module.exports = {role_worker, set_task}
