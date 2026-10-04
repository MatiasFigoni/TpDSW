  import { Category } from './category.entity.js';
  import { Request, Response, NextFunction } from 'express';  
  import { orm } from '../shared/db/orm.js'
    const em = orm.em;


    function sanitizeCategoryData(req: Request, res:Response, next: NextFunction) {
    req.body.sanitizedInput = {
        description: req.body.description,
        hourly_price: req.body.hourly_price         
    };
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}

    async function findAll(req: Request, res:Response) {
        try {
            const result = await em.find(Category, {});
            res.status(200).json({ message: 'Categories found', data: result });
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
            }
                            }

    async  function findOne(req: Request, res:Response){
        try { 
        const catid = +req.params.id
        if (Number.isNaN(catid)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }
        const ret= await em.findOneOrFail(Category,{ id:catid});
         res.status(200).json({message : 'category found ', data:ret});
        }
        catch (error: any){
        res.status(500).json({message: error.message})
                    }
                        }

                                
    async function add(req: Request, res:Response){
        try{
            const { description, hourly_price } = req.body.sanitizedInput || {};
    if (!description || hourly_price === undefined) {
      return res.status(400).json({ message: 'Missing required fields: description and hourly_price are required.' });
    }

        const category = em.create(Category, req.body.sanitizedInput);
            await em.flush();

        res.status(201).json({message:'The Category has succesfuly been created', data:category});
            }
        catch(error: any){
            res.status(500).json({message: error.message})
        }  
                        }                
async function update(req: Request, res:Response) {
    try {
    
    const idToSearch= Number.parseInt(req.params.id);
        if (Number.isNaN(idToSearch)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const categoryFound = await em.findOneOrFail(Category, { id : idToSearch } ) 
   
        const inputData = req.body.sanitizedInput;
    if (!inputData || Object.keys(inputData).length === 0) {
      return res.status(400).json({ 
        message: 'No valid fields provided for update.' 
      });
    }
    
    em.assign(categoryFound, req.body.sanitizedInput)
        await em.flush()
        
        res.status(200).json({message:'The Category has succefuly been updated',data: categoryFound})
    }
                catch(error: any){
                    res.status(500).json({message: error.message})
                }
                }

async function remove (req: Request, res:Response){
    try {
        const   idOfCategoryToDelete= +req.params.id ;
        if (Number.isNaN(idOfCategoryToDelete)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
        }
        const catToDelete = await em.findOneOrFail(Category, { id: idOfCategoryToDelete })
          
            em.remove(catToDelete);
            await em.flush();
            res.status(200).json({message:' the Category has succesfully been deleted'})
            } 
        
        catch(error: any){
            res.status(500).json({message: error.message})
        }
        }


export { sanitizeCategoryData, findAll, findOne, add, update, remove };
