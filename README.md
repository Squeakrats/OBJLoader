OBJLoader.js
========

#### JavaScript .obj File Loader ####

Provides two methods for loading .obj files into javascript. Method one is for loading
them via ajax, however this can lead to problems when the webpage is not being served from a webserver. 
Method 2 loads a pre-parsed file (javascript) directly as a script tag. 


### Usage 1 ###
Either download OBJLoader.js or include it directly from here. 

```html
<script src="<TODO.js"></script>
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



