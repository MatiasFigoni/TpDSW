// Comandos para DB

// use CyberDB

//insert data
db.computers.insertOne({
  category: "Gaming",
  description: "PC de alto rendimiento",
  price: 1500,
  stock: 1
})

db.computers.find()


//update 
db.computers.updateOne({ category: "Gaming" }, { $set: { description: "PC de bajo rendimiento" } })

//delete
db.computers.deleteOne({ category: "Gaming" })