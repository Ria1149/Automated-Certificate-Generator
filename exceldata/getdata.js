const reader = require('xlsx');
const exceldataschema = require('../models/excelschema');

exports.getExcelData =  async (file)=>{
    try{
      
        let data = []
        const sheets = file.SheetNames;
        for(let i=0;i<sheets.length;i++){
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
                temp.forEach((res)=>{
                    data.push(res);
                })
        }
        
    for (let i = 0; i < data.length; i++) {

        const not = data[i].amount / 100;

        const alreadyExists = await exceldataschema.findOne({email: data[i].email})

        const temp = {
            name: data[i].name,
            mobile_number: data[i].mobile_number,
            email: data[i].email,
            amount: data[i].amount,
            no_of_trees: not
        }

        if (!alreadyExists) {
            const tempData = new exceldataschema(temp)
            console.log(tempData)
            await tempData.save()
        }


    }
    }
    catch(error){
        console.log('Error inserting data: ',error);
    }
    
}