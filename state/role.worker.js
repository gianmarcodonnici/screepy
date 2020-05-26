var config = require('config');
//TODO: handle ERR_FULL on spawn

var role_worker = {

    /** @param {Creep} creep **/
    run_worker: function(creep) {
        switch(creep.memory.state) {
            case config.states.IDLE:
                //TODO: some code duplication here
                creep.memory.state = config.states.MOVE;
                creep.memory.state_data = creep.room.find(FIND_SOURCES_ACTIVE)[0].id;
                //TODO: handle multiple sources
                creep.memory.state_next = config.states.HARVEST;                  
                break;
            case config.states.MOVE:
                var target = Game.getObjectById(creep.memory.state_data);
                creep.moveTo(target);
                if (creep.pos.isNearTo(target) == true) {
                    //creep arrived
                    creep.memory.state = creep.memory.state_next;
                }
                break;
            case config.states.HARVEST:
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    //harvest until full
                    creep.harvest(Game.getObjectById(creep.memory.state_data));
                }
                else {
                    //creep is full, await orders
                    creep.memory.state = config.states.FULL;
                    creep.memory.state_data = null;
                    creep.memory.state_next = null;
                }
                break;
            case config.states.TRANSFER:
                if (creep.store[RESOURCE_ENERGY] > 0) {
                    //creep is full, transfer energy
                    var result = creep.transfer(Game.getObjectById(creep.memory.state_data), RESOURCE_ENERGY);
                    if (result == ERR_FULL) {
                        creep.memory.state = config.states.FULL;
                        creep.memory.state_data = null;
                        creep.memory.state_next = null;
                    }
                }
                else {
                    //move back to the source to get more Energy
                    creep.memory.state = config.states.MOVE;
                    creep.memory.state_data = creep.room.find(FIND_SOURCES_ACTIVE)[0].id;
                    //TODO: handle multiple sources
                    creep.memory.state_next = config.states.HARVEST;
                }
                break;
            case config.states.UPGRADE:
                if (creep.store[RESOURCE_ENERGY] > 0) {
                    //creep is full, transfer energy
                    creep.upgradeController(Game.getObjectById(creep.memory.state_data));
                }
                else {
                    //move back to the source to get more Energy
                    creep.memory.state = config.states.MOVE;
                    creep.memory.state_data = creep.room.find(FIND_SOURCES_ACTIVE)[0].id;
                    //TODO: handle multiple sources
                    creep.memory.state_next = config.states.HARVEST;                
                }
                break;
        }
	}
};

module.exports = role_worker;
