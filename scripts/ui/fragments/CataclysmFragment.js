/** a simple collapser for cataclysms*/
module.exports = extend(Fragment, {
    consequences: [],
    title: "",
    text: "",
    duration: 0,

    collapse(title, duration, consequences){
        this.title = title;
        this.duration = duration;
        this.consequences = consequences;

        this.buildText();
    },
    buildText(){
        this.text = Core.bundle.get("stat.consequence") + ": ";

        if(this.consequences.length > 0){
            this.consequences.forEach(e => {
                this.text += e.name + (this.consequences.indexOf(e) != this.consequences.length - 1 ? ", " : "");
            });
        } else this.text += "[lightgray]" + Core.bundle.get("none");
    },
    build(parent){
        parent.fill(null, t => {
            t.top();
            t.visible = Vars.ui.hudfrag.shown;
    
            t.collapser(v => v.add().height(38), () => Vars.state.isPaused() || Core.settings.getBool("displayCoreItems")).row();
    
            t.table(null, b => {
                b.collapser(top => top.table(null, m => {

                    m.table(null, tt => {
                        tt.background(Styles.black6).add("").pad(8).update(label => {

                            label.color.set(Color.orange).lerp(Color.scarlet, Mathf.absin(Time.time, 2, 1))
                            label.setText(this.title);
        
                        })
                    });

                    m.row();

                    m.table(null, tt => {
                        tt.add("").pad(1).update(label => {
                            label.setText(this.text);
                            label.setFontScale(0.83);
                        });
                    });

                }), true, () => {
                    if(!Vars.ui.hudfrag.shown || Vars.state.isPaused()) return false;
                    if(Vars.state.isMenu()){
                        this.duration = 0
                        return false;
                    }
                    return (this.duration -= Time.delta) > 0;
                })
                .touchable(Touchable.disabled)
                .fillX().row();
            });
        });
    }
});