
//Constants
var constants = {};
constants['WORKER_SMALL_MAX'] = 6;

//creep body configurations
var creep_bodies = {};
creep_bodies['WORKER_SMALL'] = [WORK,CARRY,MOVE];


//TODO: maybe move states and tasks to role_worker?
//creep states
var states = {          //state_data:
    IDLE: 0,             //null
    MOVE: 1,           //target to move to
    HARVEST: 2,       //source
    TRANSFER: 3,         //target for transfer
    FULL: 4,             //null
    UPGRADE: 5          //controller
};

var tasks = {
    IDLE: 0,
    CHARGE_SPAWN: 1,
    UPGRADE_CONTROLLER: 2
};

module.exports = {
    constants,
    creep_bodies,
    states,
    tasks
};
