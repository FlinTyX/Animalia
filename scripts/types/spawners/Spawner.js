module.exports = function(invalid, run){
    this.invalid = invalid;
    this.runnable = run;
    Events.on(Trigger.update.getClass(), () => {
        if(this.invalid() || !Vars.state.isPlaying() || Vars.net.client()) return;

        this.runnable();
    });
}