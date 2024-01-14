import { createRouter, createWebHistory } from 'vue-router';
import LoginUser from './components/LoginUser.vue'
import MyOrders from './components/MyOrders.vue'
import Products from './components/Products.vue'
import Cart from './components/Cart.vue'
import ProductView from './components/ProductView.vue'
import Checkout from './components/Checkout.vue'
import OrderManager from './components/OrderManager.vue'
import CreateOrder from './components/CreateOrder.vue'
import ProductManager from './components/ProductManager.vue'
import EditProduct from './components/EditProduct.vue'
import DeliveryManager from './components/DeliveryManager.vue'
import EditDelivery from './components/EditDelivery.vue'
import PaymentManager from './components/PaymentManager.vue'
import EditPayment from './components/EditPayment.vue'
import UserCreate from './components/UserCreate.vue'


const routes = [
    
    {
      path: '/login',
      component: LoginUser,
      props: true, // or props: ['id']
      
    },
    {
      path: '/register',
      component: UserCreate,
      props: true, // or props: ['id']
      
    },
    {
      path: '/myorders',
      component: MyOrders,
      props: true, // or props: ['id']
      
    },
    {
      path: '/products',
      component: Products,
      props: true, // or props: ['id']
      
    },
    {
      path: '/cart',
      component: Cart,
      props: true, // or props: ['id']
      
    },
    {
      path: '/products/:id',
      name: 'productview',
      component: ProductView,
      props: true, // or props: ['id']
      
    },
    {
      path: '/checkout',
      component: Checkout,
      props: true, // or props: ['id']
      
    },
    {
      path: '/ordermanager',
      component: OrderManager,
      props: true, // or props: ['id']
      
    },
    {
      path: '/createorder',
      component: CreateOrder,
      props: true, // or props: ['id']
      
    },
    {
      path: '/productmanager',
      component: ProductManager,
      props: true, // or props: ['id']
      
    },
    {
      path: '/productmanager/:id/edit',
      name: 'editproduct',
      component: EditProduct,
      props: true, // or props: ['id']
      
    },
    {
      path: '/deliverymanager',
      component: DeliveryManager,
      props: true, // or props: ['id']
      
    },
    {
      path: '/deliverymanager/:id/edit',
      name: 'editdelivery',
      component: EditDelivery,
      props: true, // or props: ['id']
      
    },
    {
      path: '/paymentmanager',
      component: PaymentManager,
      props: true, // or props: ['id']
      
    },
    {
      path: '/paymentmanager/:id/edit',
      name: 'editpayment',
      component: EditPayment,
      props: true, // or props: ['id']
      
    },
    

    
  
    
  
    
    
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;