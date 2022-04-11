module.exports = function(name, URL){
    this.title = Core.bundle.get("dialog.animalia-" + name + ".name");
    this.text = Core.bundle.get("dialog.animalia-" + name + ".description");
    
    this.build = function(){
        const dialog = new Dialog(),
              table = new Table();

        table.add(this.title, Styles.defaultLabel, 1).padLeft(4).center();
        table.row();
        table.image(Tex.whiteui, Pal.heal).growX().height(5).pad(5).padTop(8).width(500).align(Align.center);
        table.row();
        table.add(this.text).width(500).wrap().pad(10).get().setAlignment(Align.center, Align.center);
        table.row();

        table.table(null, t => {
            t.button("@back", Icon.left, () => {
        
                dialog.hide();
        
            }).size(200, 54).pad(8).padTop(6).align(Align.center);

            t.button("@report", Icon.link, () => {
        
                Core.app.openURI(URL());
        
            }).size(200, 54).pad(8).padTop(6).align(Align.center);
        });

        dialog.add(table);
        dialog.show();
    }
}