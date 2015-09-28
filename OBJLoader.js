/**
 *@author yusef sohail 
**/

var OBJLoader; //export variable. 
(function(exports) {

	/**
	  * @desc Loads an external file . IMPORTANT: Webpage must be served to use ajax. 
	  * @param string url - url to load.
	  * @param function cb - the function to be called with the parsed contents once the file has loaded.
	*/
	exports.load = function (url, cb) {

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
				cb(exports.parse(xmlhttp.responseText))
			}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	/**
	  * @desc Loads external files. IMPORTANT: Webpage must be served to use ajax. 
	  * @param array<string> url - urls to load
	  * @param function cb - the function to be called with a list of the parsed objects once ALL have loaded successfully 
	*/
	exports.loadAll = function (urls, cb) {
		var objs = [];
		var toLoad = urls.length;

		urls.forEach(function(url, index) {
			exports.load(url, function (obj) {
				objs[index] = obj;	
				if(--toLoad === 0) cb(objs); //all files loaded. 
			})
		})

		if(toLoad === 0 || toLoad === undefined){//nothing to load. 
			cb([]);
		}
	}

	var activeMaterial = null;

	/**
	  * @desc internal function to parse .obj files.
	  * @param string str - string to parse. IMPORTANT: str must be the contents of a .obj file.
	  * @return object - the parsed .obj file as a javascript object file. 
	*/
	exports.parse = function (str) {

		var lines = str.split("\n");

		activeMaterial = null;

		var out = {
			vertices : [],
			normals : [],
			texCoords : [],
			groups : {}
		};

		while(lines.length){
			lines = exports._parse(lines, out);
		}

		return out;

	}

	/**
	  * @desc internal function to help parsing of .obj files. Reads only one grouping. 
	  * @param array<string> lines - string to parse. IMPORTANT: lines must be the contents of a .obj file.
	  * @param object out - The object to add the so-far loaded object group. 
	*/
	exports._parse = function (lines, out) {

		var vertices = out.vertices,
			normals = out.normals,
			coords = out.texCoords,
			groups = out.groups;

		var faces = [];
		var name = null;

		var i = 0;

		mainloop:
		for(i = 0; i < lines.length;i++){//@TODO textureCoords + mateirals. + 4faced faces
			var tokens = lines[i].replace(/\s+/g, " ").split(" ")
			var t0 = tokens[0];
			switch(t0){
				case 'g':
					if(name === null){
						name = tokens[1];
					}else{
					//console.log("BREAKING!", tokens);
						break mainloop;
					}
					break;
				case "usemtl":
						activeMaterial = tokens[1];
					break;
				case 'v':
					vertices.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
					break;
				case 'vt':
					coords.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
					break;
				case 'vn':
					normals.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
					break;
				case 'f':
					var face =  [ tokens[1].split("/"),  tokens[2].split("/"), tokens[3].split("/") ]
					for(var n = 0; n < face.length;n++){
						var v = face[n];
						for(var j = 0; j < v.length;j++){
							v[j] = (v[j].length)? parseInt ( v[j] )-1: null;
						}

						for(var j = v.length; j < 3;j++){
							v[j] = null;
						}
					}
					faces.push(face);
					break;
			}


		}

		if(name !== null){
			groups[name] = {
				vertices : vertices,
				normals : normals,
				texCoords : coords,
				faces : faces,
				material : activeMaterial
			}
		}

		return lines.splice(i+1);
	}

	/**
	  * @desc internal function to generata a valid javascript file from a .obj string. 
	  * @param string name - name to place object. ie. Object can then be used from LoadedOBJFiles[name]
	  * @param object obj - already loaded object to stringify
	  * @return str - the parsed .obj file as a string. 
	*/
	exports.createJSString = function (name, obj) {
		var str = "var LoadedOBJFiles = LoadedOBJFiles || {} ;\n";
		str += "LoadedOBJFiles[\"" + name + "\"]= {}\n";
		str += "LoadedOBJFiles[\"" + name + "\"]" + ".vertices = " + JSON.stringify(obj.vertices) + "\n"
		str += "LoadedOBJFiles[\"" + name + "\"]" + ".normals = " + JSON.stringify(obj.normals) + "\n"
		str += "LoadedOBJFiles[\"" + name + "\"]" + ".texCoords = " + JSON.stringify(obj.texCoords) + "\n"
		str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups = {}\n"
		for(var key in obj.groups ){
			var keyStr = "'" + key + "'";
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ] = {}\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].vertices = " + "LoadedOBJFiles[\"" + name + "\"]" + ".vertices\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].normals = " + "LoadedOBJFiles[\"" + name + "\"]" + ".normals\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].texCoords = " + "LoadedOBJFiles[\"" + name + "\"]" + ".texCoords\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].faces = " + JSON.stringify(obj.groups[key].faces) + "\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].material ='" + obj.groups[key].material + "'\n"

		}
		return str;
	}

})(OBJLoader = {})
