
module.exports.loop = function () {
    var manager = require('manager');
    manager.run_manager();

    //Clean Memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}
