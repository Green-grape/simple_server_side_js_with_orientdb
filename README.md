# orientdb_serverside_js
<title>1. Plan</title>
<p>
    get("topic/"): topic.pug
    get("topic/:id"): topic.pug
    get("topic/add"): add.pug
        post("topic/add") 
        get("topic/:id")
    get("topic/:id/edit"): edit.pug
        post("topic/:id/edit")
        get("topic/:id")
    get("topic/:id/delete"): delete.pug
        post("topic/:id/delete")
</p>

