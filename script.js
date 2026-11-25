const recipes=window.MEALMATE_RECIPES||[];
const stores=['Reliance Smart','More','DMart','BigBasket','Local Supermarket'];
const storeRates={
  'rice':[72,68,65,70,75], 'urad dal':[125,119,115,122,130],
  'onion':[38,42,35,39,36], 'tomato':[32,35,29,33,30],
  'potato':[32,30,28,31,35], 'oil':[145,152,139,148,140],
  'cooking oil':[145,152,139,148,140], 'salt':[22,20,19,21,18],
  'paneer':[95,105,92,99,99], 'chicken':[120,135,118,128,125],
  'fish pieces':[160,175,158,168,155], 'milk':[30,32,29,31,29],
  'wheat flour / required flour':[48,52,45,49,46], 'mixed vegetables':[55,60,50,56,52]
};
let wishlist=JSON.parse(localStorage.getItem('mm_wishlist')||'[]'),shopping=JSON.parse(localStorage.getItem('mm_shopping')||'[]'),planner=JSON.parse(localStorage.getItem('mm_planner')||'{}');let current=null,activeCategory='All',visibleRecipes=recipes;
const $=id=>document.getElementById(id);const money=n=>'₹'+Math.round(n);
function save(){localStorage.setItem('mm_wishlist',JSON.stringify(wishlist));localStorage.setItem('mm_shopping',JSON.stringify(shopping));localStorage.setItem('mm_planner',JSON.stringify(planner));counts()}
function counts(){$('wishCount').textContent=wishlist.length?`(${wishlist.length})`:'';$('shopCount').textContent=shopping.length?`(${shopping.length})`:''}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2000)}
function showPage(p){['home','detail','wishlist','shopping','planner'].forEach(x=>$(x+'Page').classList.toggle('hidden',x!==p));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===p));if(p==='wishlist')renderWishlist();if(p==='shopping')renderShopping();if(p==='planner')renderPlanner();scrollTo({top:0,behavior:'smooth'})}
function initCategories(){let cats=['All',...new Set(recipes.map(r=>r.category))];$('categories').innerHTML=cats.map(c=>`<button class="chip ${c==='All'?'active':''}" data-cat="${c}">${c} ${c==='All'?'('+recipes.length+')':''}</button>`).join('');document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));filterRecipes()})}
function filterRecipes(){let q=$('search').value.toLowerCase().trim();visibleRecipes=recipes.filter(r=>(activeCategory==='All'||r.category===activeCategory)&&(`${r.name} ${r.category} ${r.description}`).toLowerCase().includes(q));$('resultCount').textContent=visibleRecipes.length;renderRecipes(visibleRecipes)}
function estimated(r){return r.ingredients.reduce((sum,i)=>sum+Number(i.qty||1)*8,0)}
function renderRecipes(list){$('recipeGrid').innerHTML=list.length?list.map(r=>`<article class="recipe"><div class="foodpic" data-photo-id="${r.id}"><span class="photo-fallback">${r.emoji}</span></div><div class="recipebody"><h3>${r.name}</h3><div class="meta"><span>◷ ${r.prepTime+r.cookTime} min</span><span>• ${r.difficulty}</span></div><div class="row"><span class="price">Est. ${money(estimated(r))}</span><button class="smallbtn" onclick="openRecipe('${r.id}')">View recipe →</button></div></div></article>`).join(''):'<div class="empty" style="grid-column:1/-1">No matching recipes. Try another search or category.</div>';observeRecipePhotos()}
function formatQty(q){return Number.isInteger(q)?q:(Math.round(q*100)/100)}
function quantity(i,servings){let q=Number(i.qty);if(!Number.isFinite(q))return i.qty;return `${formatQty(q*servings/4)} ${i.unit}`}
function priceRow(i){let key=i.name.toLowerCase(),raw=Number(i.qty),factor=Number.isFinite(raw)?raw:1,base=Math.max(15,Math.round(factor*18)),vals=storeRates[key]||[base,Math.round(base*1.04),Math.round(base*.96),Math.round(base*1.02),Math.round(base*.98)],min=Math.min(...vals);return `<tr><td>${i.name}</td>${vals.map(v=>`<td class="${v===min?'best':''}">${money(v)}</td>`).join('')}<td>${i.unit}</td></tr>`}
function renderDetail(servings=4){let r=current;$('detailContent').innerHTML=`<div class="detailtop"><div class="detailpic" data-photo-id="${r.id}"><span class="photo-fallback">${r.emoji}</span></div><div><div class="eyebrow">${r.category.toUpperCase()} · RECIPE ${r.id.slice(-3)} OF 200</div><h2>${r.name}</h2><p class="muted">${r.description}</p><div class="stats"><span>◷ Prep ${r.prepTime} min</span><span>♨ Cook ${r.cookTime} min</span><span>◈ ${r.difficulty}</span><span>♧ ${servings} servings</span></div><button class="smallbtn" onclick="toggleWish('${r.id}')">${wishlist.includes(r.id)?'♥ Saved to wishlist':'♡ Save to wishlist'}</button></div></div>
<div class="toolbar"><label for="servings">Adjust servings</label><select id="servings" onchange="renderDetail(Number(this.value))">${[2,4,6,8,10,12].map(n=>`<option ${n===servings?'selected':''}>${n}</option>`).join('')}</select><button class="primary" onclick="addRecipeToShopping('${r.id}',${servings})">＋ Add ingredients to shopping list</button></div>
<div class="detailgrid"><div class="panel"><h3>🥕 Ingredients for ${servings} servings</h3>${r.ingredients.map(i=>`<div class="ingredient"><div><strong>${i.name}</strong><small>Base recipe: ${i.qty} ${i.unit} for 4 servings</small></div><strong>${quantity(i,servings)}</strong></div>`).join('')}</div><div class="panel"><h3>🏷️ Estimated store price comparison</h3><p class="muted" style="font-size:12px">Illustrative sample pack/ingredient estimates in ${$('city').value}; confirm prices with stores.</p><div style="overflow-x:auto"><table class="compare"><thead><tr><th>Ingredient</th>${stores.map(store=>`<th>${store}</th>`).join('')}<th>Unit</th></tr></thead><tbody>${r.ingredients.map(priceRow).join('')}</tbody></table></div><div class="notice">These are demonstration estimates, not verified live prices or store inventory. The city selector is a project demo control, not a live nearby-store locator.</div></div></div>
<div class="panel"><h3>👩‍🍳 Step-by-step cooking method</h3><p class="muted">Follow the steps in order. Cooking times can vary by stove, pan and ingredient size.</p>${r.steps.map((s,i)=>`<div class="step"><span class="num">${i+1}</span><span>${s}</span></div>`).join('')}</div>`;loadRecipePhoto(r.id,true)}
function openRecipe(id){current=recipes.find(r=>r.id===id);renderDetail(4);showPage('detail')}
function toggleWish(id){wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];save();if(current)renderDetail(Number($('servings')?.value||4));toast(wishlist.includes(id)?'Recipe saved':'Removed from wishlist')}
function addRecipeToShopping(id,servings){let r=recipes.find(x=>x.id===id);r.ingredients.forEach(i=>{let label=`${i.name} — ${quantity(i,servings)}`;if(!shopping.some(x=>x.label===label))shopping.push({label,done:false})});save();toast('Ingredients added to shopping list')}
function renderWishlist(){let list=recipes.filter(r=>wishlist.includes(r.id));$('wishlistContent').innerHTML=list.length?`<div class="recipegrid">${list.map(r=>`<article class="recipe"><div class="foodpic" data-photo-id="${r.id}"><span class="photo-fallback">${r.emoji}</span></div><div class="recipebody"><h3>${r.name}</h3><div class="meta">${r.category} · ${r.prepTime+r.cookTime} min</div><div class="row"><button class="smallbtn" onclick="openRecipe('${r.id}')">Open recipe →</button><button class="smallbtn" onclick="toggleWish('${r.id}');renderWishlist()">Remove</button></div></div></article>`).join('')}</div>`:'<div class="empty">♡<br><br>No saved recipes yet. Open a recipe and save it to your wishlist.</div>';observeRecipePhotos()}
function renderShopping(){$('shoppingContent').innerHTML=shopping.length?shopping.map((x,i)=>`<div class="listitem ${x.done?'done':''}"><input type="checkbox" ${x.done?'checked':''} onchange="shopping[${i}].done=this.checked;save();renderShopping()"><span style="flex:1">${x.label}</span><button class="smallbtn" onclick="shopping.splice(${i},1);save();renderShopping()">Remove</button></div>`).join(''):`<div class="empty">Your list is empty. Add ingredients from a recipe or type an item above.</div>`}
function renderPlanner(){let days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],meals=['Breakfast','Lunch','Dinner'];$('plannerGrid').innerHTML=days.map(d=>`<div class="day"><strong>${d}</strong>${meals.map(m=>`<select aria-label="${d} ${m}" onchange="planner['${d}_${m}']=this.value;save()"><option value="">${m}</option>${recipes.map(r=>`<option value="${r.id}" ${planner[d+'_'+m]===r.id?'selected':''}>${r.name}</option>`).join('')}</select>`).join('')}</div>`).join('')}

// Real food photos from Foodish's published static image library.
// The API documents static paths such as /images/biryani/biryani32.jpg.
// Use deterministic image selection so cards do not all show the same photo.
const photoCounts={biryani:81,burger:87,'butter-chicken':22,dessert:36,dosa:83,idly:77,pasta:34,pizza:95,rice:35,samosa:22};
function foodishCategory(r){
 const n=(r.name||'').toLowerCase(),c=(r.category||'').toLowerCase();
 if(/dosa|uttapam|pesarattu|appe|idli|idly/.test(n))return 'dosa';
 if(/biryani/.test(n))return 'biryani';
 if(/butter chicken/.test(n))return 'butter-chicken';
 if(/samosa|pakora|vada|cutlet|kachori|bhaji|bonda/.test(n))return 'samosa';
 if(/pizza/.test(n))return 'pizza';
 if(/burger/.test(n))return 'burger';
 if(/noodle|pasta|manchurian|chow mein|fried rice/.test(n))return 'pasta';
 if(/halwa|kheer|payasam|gulab|rasgulla|cake|ice cream|laddu|ladoo|sweet|dessert/.test(n)||c==='desserts')return 'dessert';
 if(/rice|pulao|pongal|khichdi|thali|sambar|curry/.test(n))return 'rice';
 if(c==='breakfast')return 'idly';
 if(c==='snacks')return 'samosa';
 if(c==='indo-chinese')return 'pasta';
 if(c==='lunch'||c==='dinner'||c.includes('andhra')||c.includes('south indian'))return 'rice';
 return 'dessert';
}
function photoNumber(r,cat,attempt=0){
 const count=photoCounts[cat]||35;
 const key=(r.id||'')+(r.name||'');let hash=0;
 for(let i=0;i<key.length;i++)hash=((hash<<5)-hash+key.charCodeAt(i))|0;
 return ((Math.abs(hash)+attempt*17)%count)+1;
}
function photoCandidates(r){
 const cat=foodishCategory(r),count=photoCounts[cat]||35,base=photoNumber(r,cat,0);
 const nums=[base,((base+16)%count)+1,((base+31)%count)+1];
 return nums.map(n=>`https://foodish-api.com/images/${cat}/${cat}${n}.jpg`);
}
function loadRecipePhoto(id){
 const r=recipes.find(x=>x.id===id);if(!r)return;
 document.querySelectorAll(`[data-photo-id="${id}"]`).forEach(node=>{
  if(!node.isConnected||node.querySelector('img'))return;
  const urls=photoCandidates(r),img=document.createElement('img');let attempt=0;
  img.alt='Food photograph for '+r.name;img.loading='lazy';img.decoding='async';
  img.onerror=()=>{attempt++;if(attempt<urls.length){img.src=urls[attempt]}else{img.remove();const fallback=node.querySelector('.photo-fallback');if(fallback)fallback.style.display='grid'}};
  img.onload=()=>{const fallback=node.querySelector('.photo-fallback');if(fallback)fallback.style.display='none'};
  node.appendChild(img);img.src=urls[0];
 });
}
function observeRecipePhotos(){
 if(!('IntersectionObserver'in window)){document.querySelectorAll('[data-photo-id]').forEach(n=>loadRecipePhoto(n.dataset.photoId));return;}
 if(photoObserver)photoObserver.disconnect();
 photoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const node=entry.target;photoObserver.unobserve(node);loadRecipePhoto(node.dataset.photoId)}}),{rootMargin:'250px'});
 document.querySelectorAll('[data-photo-id]').forEach(node=>{if(!node.querySelector('img'))photoObserver.observe(node)});
}
let photoObserver;
$('searchBtn').onclick=filterRecipes;$('search').addEventListener('keydown',e=>{if(e.key==='Enter')filterRecipes()});$('backBtn').onclick=()=>showPage('home');document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>showPage(b.dataset.page));$('city').onchange=()=>toast('Selected city: '+$('city').value+' · sample prices shown');$('addManual').onclick=()=>{let v=$('manualItem').value.trim();if(!v)return;shopping.push({label:v,done:false});$('manualItem').value='';save();renderShopping();toast('Item added')};$('manualItem').addEventListener('keydown',e=>{if(e.key==='Enter')$('addManual').click()});$('clearShop').onclick=()=>{if(confirm('Clear the entire shopping list?')){shopping=[];save();renderShopping()}};
initCategories();renderRecipes(recipes);counts();
