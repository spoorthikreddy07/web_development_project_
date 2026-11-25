MEALMATE - SMART RECIPE & GROCERY PLANNER

FILES
- index.html: HTML5 page structure
- style.css: CSS3 responsive interface
- recipes.js: 200 recipe catalogue (names, ingredients, timings, difficulty and cooking steps)
- script.js: JavaScript search, serving calculator, wishlist, shopping list, price demo and planner

RUN IN VS CODE
1. Extract the ZIP file.
2. Open the extracted MealMate_Project folder in VS Code.
3. Install the Live Server extension (Ritwick Dey), if needed.
4. Right-click index.html and choose Open with Live Server.
5. Keep all four code files in the same folder.

FEATURES
- 200 recipes across 10 categories
- Search and category filtering
- Ingredient quantities scale for 2, 4, 6, 8, 10 or 12 servings
- Step-by-step cooking method for every recipe
- Wishlist, shopping list and weekly meal planner using Local Storage
- Illustrative store price comparison

IMPORTANT PROJECT LIMITATION
Store prices are sample demonstration estimates, not live supermarket prices. City selection is not GPS/location search. For real prices and nearby inventory, connect a verified retailer API or maintain a researched store-price database and explain the data source in your report.

ACADEMIC NOTE
Review and test recipes, ingredient quantities and cooking instructions before presenting. Cooking times and results vary by equipment and ingredients.

STORE PRICE COMPARISON UPDATE
The demo comparison now includes five columns: Reliance Smart, More, DMart, BigBasket and Local Supermarket. DMart and BigBasket are added as popular Indian retail/grocery options. All displayed prices are illustrative sample values for project demonstration only; they are not live or verified store prices.

FOOD PHOTOGRAPHS
- Recipe cards, wishlist cards and recipe detail pages now load real food photographs online.
- The app first checks TheMealDB for an exact dish-name match. If no exact match is available, it uses a real category-level food photograph from Foodish as a fallback.
- These are not AI-generated pictures. TheMealDB API documentation: https://www.themealdb.com/docs_api_guide.php
- Foodish photo API documentation: https://github.com/surhud004/Foodish
- An internet connection is required for photographs. If an image service is unavailable, the recipe emoji remains as a fallback.
- Category-level fallback photos are representative images, not guaranteed to depict the exact recipe. Review photo matches before a formal/public release and follow each provider's attribution/usage terms.


FOOD PHOTOGRAPHS
The recipe cards use real food photographs from the Foodish public image library.
The images load from the internet, so keep your laptop connected while using Live Server.
The image library provides category-level photos (for example dosa, biryani, idly, dessert),
so a few dishes may show a representative photo rather than an exact dish match.
If an image URL is unavailable, the recipe emoji is shown as a fallback.
Image source documentation: https://github.com/surhud004/Foodish

