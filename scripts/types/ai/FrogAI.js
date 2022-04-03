module.exports = function(object){
    return extend(AIController, Object.assign({
        updateMovement(){
            if(this.unit.onLiquid()){
                if(Mathf.chanceDelta(0.01) && this.unit.canSwim()){
                    this.unit.startSwim();
                }

                return;
            }

            if(this.unit.canJump()){
                this.unit.jump(70);
            }
        }
    }, object));
}