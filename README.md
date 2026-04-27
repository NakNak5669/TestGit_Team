+ install (npm i axios) for learn axios
+ create .env for main api (VITE_API_URL=https://api.escuelajs.co/api/v1)

+ note folder api = service

1. create /api/http.js for fetch .env
2. create /api/products.js fetch api
3. create /api/categories.js fetch api
4. create /lib/normalizeProduct.js (ស្តង់ដា project ពិតៗ) គេធ្វើ API layer មុន ហើយធ្វើ normalize ក្រោយ 
    + normalizeProduct.js បង្កើតឡើង ដើម្បី “ធ្វើឲ data ពី API មានទម្រង់ស្ដង់ដា” មុនយកទៅប្រើក្នុង UI
        ព្រោះ data ពី API មិនសូវស្អាតជានិច្ច ហើយអាចមាន:
        - field ខ្វះ (images ទទេ, category មិនដូចគ្នា)
        - type មិនត្រឹម (price ជា string)
        - structure ខុស (ខ្លះ category ជា object {name} ខ្លះជា string)
        - UI របស់យើងត្រូវការ field ថេរៗ ដើម្បីកុំ crash
    + Project ពិតៗគេមាន normalize មិនត្រឹម product ទេ៖
        - normalizeProduct(product)
        - normalizeUser(user)
        - normalizeCategory(category)
        - normalizeOrder(order)
        - normalizeAuthTokens(tokens)
5. crate /lib/normalizeCategory.js (បើមិន api ទៀតធ្វើទៀត)
6. fetch api
    - Home.jsx 
    - ProductCard.jsx
    - ProductDetails.jsx
7. create /lib/debounce.js (កុំឲពេលបញ្ចូលលេខក្នុង Exact price and price range​ ម្តង refresh ម្តង)
+ មុនពេលដែលយើងអាច​ធ្វើ context បានទាំងមិនទាន់ fetch api និង fetch api ហើយ​​ យើងត្រូវតែមាន product , category...ដែលត្រូវបញ្ចូលទៅក្នុង Home.jsx(main page) ឲហើយសិន ទើបយើងធ្វើ Context
8. make Context
- cartContext.jsx
9. Fetch Auth JWT(Standard Api: Login , Retrieving User Profile, Refreshing Access Token, for Register in User(Api) )
    + សង្ខេបស្តង់ដា (Register → Login → Profile → Refresh)
        - Register: POST /users(Api Users)
        - Login: POST /auth/login(Api Auth)
        - Profile: GET /auth/profile (Bearer access_token)(Api Auth)
        - Refresh: POST /auth/refresh-token (refreshToken)(Api Auth)

+ Create /api/auth.js
+ Create /users.js (for Register)
+ Create /AuthContext.jsx (core logic)
+ Create /ProtectedRoute.jsx (lock checkout បើសិនអត់ទាន់ Login ទេពេល Checkout ត្រូវទៅ Login)
+ Update main.jsx(ពីព្រោះត្រូវបន្ថែម AuthProvider​ ដែលនៅក្នុង context/AuthContext.jsx)
+ Add ProtectedRoute in Checkout (router.jsx) 
+ Update Login.jsx(Fetch Api)
+ Update Register.jsx(Fetch Api)
+ Update Profile.jsx(Fetch Api)
+ Update Header.jsx (For Link Login and Register and Profile)



nak thork