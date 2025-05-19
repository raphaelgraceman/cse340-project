-- Query 1---
INSERT INTO public.account 
  (account_firstname, account_lastname, account_email, account_password ) 
VALUES 
  ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n' );



--Query 2 ---Update Query
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


---Query 3    ---- Delete query for Tony Stack from the  Database
DELETE FROM public.account 
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Query 4 -- 
--Replacing 'small interiors' with 'a huge interior' in the inv_description column
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';



--Query 5 
--  Using INNER JOIN selecting from different columns in two distinct table 
SELECT inv.inv_make, inv.inv_model, c.classification_name  
FROM public.inventory inv  
INNER JOIN public.classification c  
	ON inv.classification_id = c.classification_id  
WHERE c.classification_name = 'Sport';


---Query 6 ---
--Updating inventory image and thumbnails directories 
-- include a folder called vehicle.
UPDATE public.inventory  
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),  
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
