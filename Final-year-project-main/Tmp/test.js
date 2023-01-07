let Chain=undefined;
  		let ChainColl="";
		switch(request.params.chain){
          case 1:
            	Chain = Moralis.Object.extend("EthTransactions");
            	ChainColl="EthTransactions";
            	break;
          case 80001:
            	Chain = Moralis.Object.extend("PolygonTransactions");
            	ChainColl="PolygonTransactions";
            	break;
          case 137:
            	Chain = Moralis.Object.extend("PolygonTransactions");
            	ChainColl="PolygonTransactions";
            	break;
          case 43113:
            	Chain = Moralis.Object.extend("AvaxTransactions");
            	ChainColl="AvaxTransactions";
            	break;
          case 56:
            	Chain=Moralis.Object.extend("BscTransactions");
            	ChainColl="BscTransactions";
            	break;
          case 97:
            	Chain=Moralis.Object.extend("BscTransactions");
            	ChainColl="BscTransactions";
            	break;
          default:
            	break;
        }
  		if(Chain){
        	const trans=await new Parse.Query(Chain).aggregate([
            	{
                  match:{'receiverAddress':request.params.addr}
                },
              	{
                  unionWith:{
                    coll:ChainColl,
                    pipeline:[
                      {
                        $match:{'senderAddress':request.params.addr}
                      }
                    ]
                  }
                },
              	{
                  sort:{'block_timestamp':-1}
                }
            ]);
        	const Tran= Moralis.Object.extend("Transactions");
          	let stats=[];
          	for(let i=0;i<trans.length;i++){
              	const trn=await new Moralis.Query(Tran).equalTo('transactionHash',trans[i].hash).first();
              	if(trn){
                  stats.push({
                	confirm:trans[i].confirmed,
                  	gas:trans[i].gas,
                  	senderName:trn.get('senderName'),
  					receiverName:trn.get('receiverName'),
  					units:trn.get('units'),
  					catg:trn.get('Category'),
  					desc:trn.get('Description'),
  					network:trn.get('Network'),
  					sendAddr:trn.get('senderAddress'),
   					recvAddr:trn.get('receiverAddress'),
  					transactionhash:trn.get('transactionHash'),
                    tstamp:trans[i].block_timestamp,
                    tokenAddress:trn.get('Token')
                });
              }
            }
        }
