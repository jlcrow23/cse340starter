--Insert Tony Stark into `account` table
INSERT INTO public.account
VALUES (DEFAULT, 'Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

--Change Tony Stark `acount_type`
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete Tony Stark
DELETE FROM public.account WHERE account_id = 1;

-- Modify GM Hummer record
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- inner join query
SELECT inv_make, inv_model, classification_name
FROM public.inventory
    JOIN public.classification
    ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- Update records to add `/vehicles`
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');