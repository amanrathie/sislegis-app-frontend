angular.module('sislegisapp').controller('ElaboracaoNormativaController',
		function($scope, $http, $routeParams, $location, $locale, $parse, toaster, ElaboracaoNormativaResource, EquipeResource, FileUploader, TagResource,
				AreaConsultadaResource, OrigemElaboracaoNormativaResource, UsuarioResource, ElaboracaoNormativaConsultaResource, StatusSidofResource) {
			var self = this;
			$scope.disabled = false;
		    $scope.$location = $location;
			$scope.elaboracaoNormativa = $scope.elaboracaoNormativa || {};//new ElaboracaoNormativaResource();
			$scope.equipes = EquipeResource.queryAll();
			
		    $scope.loadTags = function(query) {
		    	return TagResource.listarTodos().$promise;
		    }; 
			
			$scope.elaboracaoNormativa.listaElaboracaoNormativaConsulta = [];
			
			$scope.elaboracaoNormativa.listaComentario = [];
			
		    $scope.tipos = ElaboracaoNormativaResource.tipos();
		    
		    $scope.identificacoes = ElaboracaoNormativaResource.identificacoes();
		    
		    $scope.listaStatusSidof = StatusSidofResource.queryAll();
		    
		    $scope.situacoes = ElaboracaoNormativaResource.situacoes();
		    
		    // inicio config upload
			$scope.distribuicaoUploader = new FileUploader( {
			    url: '../rest/upload',
			    onSuccessItem : function(item, response, status, headers) {
			    	console.log(response);
			    	$scope.elaboracaoNormativa.elaboracaoNormativaConsulta.arquivo = response;
			    	$scope.elaboracaoNormativa.listaElaboracaoNormativaConsulta.push($scope.elaboracaoNormativa.elaboracaoNormativaConsulta);
			    	$scope.elaboracaoNormativa.elaboracaoNormativaConsulta = null;
			    }
			});
			
			$scope.manifestacaoUploader = new FileUploader( {
			    url: '../rest/upload',
			    autoUpload : 'true',
			    //removeAfterUpload : 'true',
			    onSuccessItem : function(item, response, status, headers) {
			    	console.log(response);
			    	// o response contem o caminho relativo do arquivo
			    	$scope.elaboracaoNormativa.arquivoManifestacao = response;
			    },
			});
			// fim config upload
		    
		    $scope.selectParecerista = function(){
		    	console.log($scope.elaboracaoNormativa.equipe);
		    	$scope.elaboracaoNormativa.pareceristas = UsuarioResource.findByIdEquipe({idEquipe : $scope.elaboracaoNormativa.equipe.id});
		    	
		    };
		    
		    $scope.adicionarElaboracaoNormativaConsulta = function(){
		    	//TODO: Verificar erro quando não é adicionado nenhum arquivo 
		    	//$scope.distribuicaoUploader.uploadItem(0);
		    	//$scope.elaboracaoNormativa.elaboracaoNormativaConsulta.elaboracaoNormativa = $scope.elaboracaoNormativa;
		    	$scope.elaboracaoNormativa.listaElaboracaoNormativaConsulta.push($scope.elaboracaoNormativaConsulta);
		    	$scope.elaboracaoNormativaConsulta = new ElaboracaoNormativaConsultaResource();
		    }
		    
		    $scope.normas = ElaboracaoNormativaResource.normas();
		    
		    
			$scope.salvar = function() {

		        var successCallback = function(){
		        	$scope.elaboracaoNormativa = new ElaboracaoNormativaResource();
		        	toaster.pop('success', 'Elaboração Normativa salvo com sucesso');
		        };
		        var errorCallback = function() {
		        	toaster.pop('error', 'Falha na inclusão');
		        };
		        
		        if (isEditMode()) {
		        	$scope.elaboracaoNormativa.$update(successCallback, errorCallback);
		        } else {
		        	ElaboracaoNormativaResource.save($scope.elaboracaoNormativa, successCallback, errorCallback);
		        }
		        
				
			};
			
			$scope.get = function() {
		        var successCallback = function(data){
		            self.original = data;
		            $scope.elaboracaoNormativa = new ElaboracaoNormativaResource(self.original);
		        };
		        var errorCallback = function() {
		            $location.path("/ElaboracaoNormativa");
		        };
		        ElaboracaoNormativaResource.get({ElaboracaoNormativaId:$routeParams.ElaboracaoNormativaId}, successCallback, errorCallback);
			};
			
		    $scope.cancel = function() {
		        $location.path("/Equipes");
		    };
			
		    function isEditMode() {
			    if ($location.path().indexOf("edit") > -1) {
			    	return true;
				}
			    return false;
		    }

		    if (isEditMode()) {
		    	$scope.get();
		    }
		    
		    $scope.excluirElaboracaoNormativa = function(){
		    	
		    }
		    

			$scope.getUsuarios = function(val) {
			    return $http.get('../rest/usuarios/find', {
			      params: {
			        nome: val
			      }
			    }).then(function(response){
			      return response.data.map(function(item){
			        return item;
			      });
			    });
			  };

			$scope.getOrigemElaboracaoNormativas = function(val) {
			    return $http.get('../rest/origemelaboracaonormativas/find', {
			      params: {
			        descricao: val
			      }
			    }).then(function(response){
			        if (val) {
			        	var item = new OrigemElaboracaoNormativaResource();
			        	item.descricao = val;
			        	response.data.unshift(item);
			        }
		    		return response.data.map(function(item){
		    			return item;
		    		});
			    },function(error){
			      console.log('Erro ao buscar dados getOrigemElaboracaoNormativas');
			    });
			  };

		    $scope.onSelectOrigemElaboracaoNormativas = function (item) {
		    	if(!item.id){
		    		item.$save(function(success){
		    			toaster.pop('success', 'Registro inserido com sucesso.');
		    		});
		    	}
		    };
				   
			$scope.getAreaConsultadas = function(val) {
			    return $http.get('../rest/areaconsultadas/find', {
			      params: {
			        descricao: val
			      }
			    }).then(function(response){
			        if (val) {
			        	var item = new AreaConsultadaResource();
			        	item.descricao = val;
			        	response.data.unshift(item);
			        }
			      return response.data.map(function(item){
			        return item;
			      });
			    });
			  };

		    $scope.onSelectAreaConsultadas = function (item) {
		    	if(!item.id){
			    	item.$save(function(success){
			    		toaster.pop('success', 'Registro inserido com sucesso.');
			    	});
		    	}
		    };
			    
			  
		    // CALENDARIO
		    $scope.setCalendar = function() {
				$scope.openCalendar = function($event, id) {
					$event.preventDefault();
					$event.stopPropagation();
					http://localhost:8080/sislegis-app/rest/elaboracaonormativa
					var opened = 'opened_'+id;
					var model = $parse(opened);
					model.assign($scope, true);
					$scope.apply;
			
				};

				$scope.dateOptions = {
					formatYear : 'yy',
					startingDay : 1
				};

		    }
		    
		    $scope.setCalendar();	
		    
		    $scope.format = 'dd/MM/yyyy';
		    
		    //Aba default
		    $scope.selected = "dadosPreliminares";
	

		});