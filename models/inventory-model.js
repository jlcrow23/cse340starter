const pool = require("../database/")

/* ***************************
* Get all classification data
* **************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 * Get all inventory items and classification_name by classification_id
 * *************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/* *****************************
* Get Details by Inventory Id
* *****************************/
async function getDetailsByInventoryId(inv_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE inv_id = $1", [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getDetailsByInventoryId error " + error)
    }
}

/* ***************************
* New Classification Add
* ************************** */
async function addClassificationId(classification_name) {
    try{
        const data = await pool.query(
            "INSERT INTO public.classification VALUES ($1)", [classification_name]
        )
        return data.rows
    } catch (error) {
        console.error("addClassificationId error" + error)
    }
}

/* ****************************
* Add a new car to the database
* ************************** */
async function addNewCar(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name) {
    try{
        const data = await pool.query(
            "INSERT INTO public.inventory VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", 
            [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color],

            "INSERT INTO public.classification VALUES ($10)",
            [classification_name]
        )
        return data.rows
    } catch (error) {
        console.error("addClassificationId error" + error)
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByInventoryId, addClassificationId, addNewCar};