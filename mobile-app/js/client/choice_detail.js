$(function() {           
				mui.init();
				var isReady = false;
				var curType = "";
				var initBinding = function() {
					window.addEventListener('showedCallback', function(event) {
						//获得事件参数
						var argdata = event.detail.argdata; 
						curType = argdata.type;
						curValue = argdata.value; 
//						alert(curType); 
						var html = "";  
				        var form = jQuery('#form1');
				        var myClientNameList = ["客户1","客户2","客户3","王强","李宁"];
				        var myTag = ["未联系","已沟通","已成交","传真","邮件","春节彩页"];
				        var myOwner = ["赵莲花","张华","李鸣","袁洪","王刚"]; 
				        var myClient = ["渠道","普通客户","代理商","合作伙伴","其他"];
				        var myTarget = ["储备客户","目标客户","潜在客户","商机客户","成交客户"];
				        var myIndustry = ["金融/投资/基金","制造业","教育/培训","生物技术行业","其他"];
				        var mySource = ["电话来访","独立开发","400电话","公司数据分配","其他"];
				        var myInterest = ["OBO","CRM"];
				        var myMarketing = ["初步咨询","跟进","成交","售前跟踪","终审拒绝","终审需二次进行"];
				        var myGender = ["未知","男士","女士"];
				        var myLinkman = ["李鸣","张华","程飞","翠花"]
//					   var titile = document.getElementById("title"); 
                       if(curType == "clientNameList"){ 
                        	for(i = 0; i < myClientNameList.length ; i++){
                        	var itemClientNameList = myClientNameList[i];  
			                title.innerHTML = "选择客户";
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemClientNameList +' </label><div class="detail_xian"></div>';                                
                         }  
                        	form.children().remove();
                        	form.append(html);                        	                           
                       }else if(curType == "tag"){ 
                        	for(i = 0; i < myTag.length ; i++){
                        	var itemTag = myTag[i];  
			                title.innerHTML = "标签";
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemTag +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();
                        	form.append(html);                        	                           
                       }else if(curType == "owner"){   
                        	for(i = 0; i < myOwner.length ; i++){
                        	var itemOwner = myOwner[i];  
			                title.innerHTML = "所有人";
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemOwner +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();
                        	form.append(html);                        	                           
                        }else if(curType == "clientType"){			                
			                for(i = 0; i < myClient.length ; i++){
                        	var itemClient = myClient[i];  
			                title.innerHTML = "客户类型"; 
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemClient +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();  
                        	form.append(html);  
                        }else if(curType == "targetClient"){			                
			                for(i = 0; i < myTarget.length ; i++){
                        	var itemTarget = myTarget[i];  
			                title.innerHTML = "客户阶段"; 
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemTarget +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();  
                        	form.append(html);  
                        }else if(curType == "industry"){			                
			                for(i = 0; i < myIndustry.length ; i++){
                        	var itemIndustry = myIndustry[i];  
			                title.innerHTML = "行业"; 
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemIndustry +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();  
                        	form.append(html);  
                        }else if(curType == "source"){			                
			                for(i = 0; i < mySource.length ; i++){
                        	var itemSource = mySource[i];  
			                title.innerHTML = "资源"; 
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemSource +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();  
                        	form.append(html);    
                        }else if(curType == "interest"){			                
			                for(i = 0; i < myInterest.length ; i++){
                        	var itemInterest = myInterest[i];  
			                title.innerHTML = "感兴趣产品"; 
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemInterest +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();  
                        	form.append(html);  
                        }else if(curType == "marketing"){			                
			                for(i = 0; i < myMarketing.length ; i++){
                        	var itemMarketing = myMarketing[i];  
			                title.innerHTML = "营销阶段";   
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemMarketing +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();  
                        	form.append(html);  
                        }else if(curType == "gender"){			                
			                for(i = 0; i < myGender.length ; i++){
                        	var itemGender = myGender[i];  
			                title.innerHTML = "性别";   
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemGender +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();  
                        	form.append(html);  
                        }else if(curType == "linkman"){			                
			                for(i = 0; i < myLinkman.length ; i++){
                        	var itemLinkman = myLinkman[i];  
			                title.innerHTML = "性别";   
			                html = html + '<input type="radio" name="opinions" id="select' +i 
			                +'" value="select' +i+ '" /><label for="select'+ i +'" class="select_item" id="check">'
					        + itemLinkman +' </label><div class="detail_xian"></div>';                                
                           }
                        	form.children().remove();  
                        	form.append(html);  
                        }
                        $('input').customInput();
						//根据id向服务器请求新闻详情
						//		alert("type=" + argdata.type);
						//		var owner = document.getElementById("owner");  
						//		owner.innerHTML = data.value; 

					jQuery(".custom-radio").each(function() {
						var _this = jQuery(this); 
						_this[0].addEventListener('tap', function() { 
							var val = jQuery(this).find(".select_item").text();
							if (isReady) {
								var self = plus.webview.currentWebview();
								var parentWV = self.parent();
								//alert(curType.value);  //从新建页面传过来的标识       
								//触发父页面的subpageCallback事件
								mui.fire(parentWV, 'subpageCallback', {
									data: { 
										type: curType,  
										value: val
									}
								});
								self.hide();
							}
						});
					});
				});
				};
				if (mui.os.plus) {
					mui.plusReady(function() {
						isReady = true;
						jQuery('input').customInput();
						initBinding();
					});
				} else {
					mui.ready(function() {
						isReady = true;
						jQuery('input').customInput();
						initBinding();
					});
				}
				
			document.getElementById("back").addEventListener('tap', function() { 
				        var self = plus.webview.currentWebview();
				        self.hide();  					
					});	
			})(mui);