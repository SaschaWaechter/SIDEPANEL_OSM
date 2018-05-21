sap.ui.controller("sidepanel_osm.map", {

	onInit: function () {
		 
		 var startadress = "Karlsruhe";
		 		 
		 var lat;
		 var lon;
		 
		  window.oGeoMap = this.getView().byId("GeoMap");
		  window.oMapConfig = {
			        "MapProvider": [{
			            "name": "Openstreetmap",
			            "copyright": "<b><a href='http://www.openstreetmap.org/copyright'>© openstreetmap</a></b>",
			            "Source": [{
			            	"id": "s1",
			            	"url": "http://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
			            	}, {
			            	"id": "s2",
			            	"url": "http://b.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
			            	}, {
				            "id": "s3",
				            "url": "http://c.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
				            }
			            	]
			        }],
			        "MapLayerStacks": [{
			                "name": "DEFAULT",
			                "MapLayer": {
			                        "name": "layer1",
			                        "refMapProvider": "Openstreetmap",
			                        "opacity": "1",
			                        "colBkgnd": "RGB(255,255,255)"
			                }
			        }]
			    };
		  window.oGeoMap.setMapConfiguration(window.oMapConfig);
		  window.oGeoMap.setRefMapLayerStack("DEFAULT");
		  window.oGeoMap.setInitialZoom(8);
		  	  
		  $.ajax({
			  url: "http://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURI(startadress),
			  encoding:"UTF-8",
			  dataType: "json",
			  async: false,			  
			  success: function(json) {
				  lat = json[0].lat;
				  lon = json[0].lon;
			  } 
			});
		  
		  window.oGeoMap.setInitialPosition(lon + ";" + lat + ";0");	 
		  			        
	        var dataContext;
	        
	        onChangedWithXML = function (eventObj){
	        	
	        	var oModel = new sap.ui.model.json.JSONModel();
	        	
	        	var lat_dyn;
	        	var lon_dyn;
	        	
	        	
	        	var street = dataContext.read("/BSSP/:STREET", "CANVAS_appData", null);
	        	var plz = dataContext.read("/BSSP/:PLZ", "CANVAS_appData", null);
	        	var ort = dataContext.read("/BSSP/:ORT", "CANVAS_appData", null);
	          	
	          	
	          	if( ( street != null && ort != null ) ){ 
	          	
	          	$.ajax({
	  			  url: "http://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURI(street) + "+" + encodeURI(plz) + "+" + encodeURI(ort),
	  			  dataType: 'json',
	  			  async: false,
	  			  encoding:"UTF-8",
	  			  success: function(json) {
	  				  lat_dyn = json[0].lat;
	  				  lon_dyn = json[0].lon;
	  			  }
	  			});
	          		          	
	          	//Marker setzen
	          	var pos_dyn = { 
			    		 Spots :
			                [
			                	{
			                "pos": lon_dyn + ";" + lat_dyn +";0",
			                "tooltip": "Standort"
			                	}
			                ]
			          };       
	          	
	          	oModel.setData(pos_dyn); 
	          	window.oGeoMap.setModel(oModel);
	          	window.oGeoMap.setCenterPosition(lon_dyn + ";" + lat_dyn + ";0");
	          	window.oGeoMap.setZoomlevel(18);
	          	
	          	}
	          	          	
	        };  
	        
	      //handle the data passed from the content area
	        dataContext = (typeof(window.external) !== "undefined") && (typeof(window.external.DataContext) !== "undefined") ?
	       window.external.DataContext : null;
	        
	        if (dataContext !== null && typeof(dataContext) !== "undefined")
	           { window.external.epcm.subscribeEventReliable("com.sap.lsapi.dataContext", "changedWithXML", undefined, "onChangedWithXML");
	        }; 
	        	        
     	},	    

});