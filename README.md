OBJLoader.js
========

#### JavaScript .obj File Loader ####

Provides two methods for loading .obj files into javascript. Method one is for loading
them via ajax, however this can lead to problems when the webpage is not being served from a webserver. 
Method 2 loads a pre-parsed file (javascript) directly as a script tag. 


### Usage 1 ###
Download OBJLoader.js and include it on your page. 

```html
<script src="https://raw.githubusercontent.com/Squeakrats/OBJLoader/master/OBJLoader.js"></script>
```

Then to load a file. 
```html
OBJLoader.load("assets/Wolf.obj", function (wolf){
  //do things with wolf
  console.log(wolf);
}
```
or alternativly to load a batch
```html
OBJLoader.loadAll(["assets/Wolf.obj", "assets/Deer.obj"], function (models){
  //all models have loaded
  console.log(models[0])//wolf.obj
  console.log(models[1])//Deer.obj
}
```
### Usage 2 ###

####Step 1####
Generate Your .objs files. These are "javascriptified" versions of your .obj
files that can be included directly into your webpage. 
[Go Here] to generate them.

#####Step 2####
Include them on your page somewhere in the <head> like this 
```html
  <script type="text/javascript" src="assets/Wolf.objjs"></script>
}
```
-- Do not include OBJLoader.js (unless you really want to).


-- type is required since the file extension is not .js. 

####Step 3#####
Use The Assets Immediately!
```html
var Wolf = LoadedOBJFiles["wolf.obj"];
var gWolf = Wolf.groups["wolf"];
for(var i = 0;i < gWolf.faces.length;i++){
  var face = gWolf.faces[i];
  console.log(face);//all the faces in wolf model!. 
}
```

####Model Format####

```html
{ 

	vertices :  [ [x, y, z] ... ]//all vertices in file, 
	normals  :  [ [x, y, z] ... ] //all normals in file 
	texCoords:  [ [x, y, z] ... ] // all coords in file  
	groups : { // .obj files can contain more than one model. 

		groupname : {

			vertices : reference to original vertices,
			normals : reference to original normals,
			texCoords : reference to original tex coords,
			faces : [ [positionIndex, texCoordIndex, normalIndex] ... ] //values can be null

		} ...

	}

}
```
 
####Average Vertex Example#####
```html
var group = LoadedOBJFiles["cube.obj"].groups["cube"];
var faces = group.faces;
var vertices = group.vertices;
var sum = [0, 0, 0], c = 0;

for(var i = 0;i<faces.length;i++){   //for each face
    var face = faces[i];
    for(var n = 0;n < face.length;n++){ //for each vertex
        var indices = face[n];
        var vertex = vertices[indices[0]] //get the vertex (indices[0] is position index)
        for(var j = 0;j < 3;j++){//for x, y, z in that vertex
            sum[j] += vertex[j]; //add to sum
        }
        c++;
    }
     
}

sum[0] /= c;
sum[1] /= c;
sum[2] /= c;
console.log(sum)
```



