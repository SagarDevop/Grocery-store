const allProducts = [
  { id: "p1", name: "Potato 500g", category: "Organic veggies",images:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7FFtYRniDMrJmbM_d3ERJMQVUtS5yJIodwA&s','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu3mraPXv9IYq8EI1iVYHcNrlSMRNpeLT0gg&s'], price: 35, image: "https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?q=80&w=884&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p2", name: "Tomato 1kg", category: "Organic veggies", price: 28, image: "https://plus.unsplash.com/premium_photo-1661811820259-2575b82101bf?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p3", name: "Carrot 500g", category: "Organic veggies", price: 44, image: "https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p4", name: "Spinach 500g", category: "Organic veggies", price: 15, image: "https://images.unsplash.com/photo-1683355739329-cea18ba93f02?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p5", name: "Onion 500g", category: "Organic veggies", price: 45, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpbmFjaHxlbnwwfHwwfHx8MA%3D%3D" },
  { id: "p6", name: "Cabbage 1kg", category: "Organic veggies", price: 30, image: "https://images.unsplash.com/photo-1668120082831-e83f387e3461?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGNhYmJhZ2V8ZW58MHx8MHx8fDA%3D" },
  { id: "p7", name: "Cauliflower 500g", category: "Organic veggies", price: 50, image: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGNhYmJhZ2V8ZW58MHx8MHx8fDA%3D" },
  { id: "p8", name: "Capsicum 250g", category: "Organic veggies", price: 60, image: "https://plus.unsplash.com/premium_photo-1675731117950-089d3b3325d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2Fwc2ljdW18ZW58MHx8MHx8fDA%3D" },
  { id: "p9", name: "Brinjal 500g", category: "Organic veggies", price: 40, image: "https://images.unsplash.com/photo-1605197378540-10ebaf6999e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnJpbmphbHxlbnwwfHwwfHx8MA%3D%3D" },

  { id: "p10", name: "Apple 1kg", price: 120, category: "Fresh Fruits", image: "https://images.unsplash.com/photo-1589217157232-464b505b197f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p11", name: "Banana 1 Dozen", price: 55, category: "Fresh Fruits", image: "https://images.unsplash.com/photo-1523667864248-fc55f5bad7e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p12", name: "Grapes 500g", price: 70, category: "Fresh Fruits", image: "https://plus.unsplash.com/premium_photo-1692809723059-a70874355d1a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p13", name: "Mango 1kg", price: 150, category: "Fresh Fruits", image: "https://images.unsplash.com/photo-1669207334420-66d0e3450283?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFuZ298ZW58MHx8MHx8fDA%3D" },
  { id: "p14", name: "Pineapple 1pc", price: 90, category: "Fresh Fruits", image: "https://images.unsplash.com/photo-1710224764630-2bddaea00868?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },

  { id: "p15", name: "Coca-Cola 750ml", price: 45, category: "Cold Drinks", image: "https://images.unsplash.com/photo-1716800586014-fea19e9453fb?q=80&w=1434&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p16", name: "Pepsi 500ml", price: 40, category: "Cold Drinks", image: "https://images.unsplash.com/photo-1571114865995-9545aedcd241?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p17", name: "Fanta 750ml", price: 42, category: "Cold Drinks", image: "https://cdn.uengage.io/uploads/5/image-913261-1716282404.jpeg" },
  { id: "p18", name: "Sprite 500ml", price: 38, category: "Cold Drinks", image: "https://5.imimg.com/data5/RJ/QN/MY-59267208/sprite-500ml-soft-drink-500x500.jpg" },
  { id: "p19", name: "Maaza 600ml", price: 50, category: "Cold Drinks", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0w9PC9QALCunwJnvH9O6DdSoZznaRYUwcNQ&s" },

  { id: "p20", name: "Amul Milk 1L", price: 60, category: "Dairy Products", image: "https://www.shutterstock.com/image-photo/new-delhi-india-may-2022-600nw-2163953449.jpg" },
  { id: "p21", name: "Paneer 200g", price: 90, category: "Dairy Products", image: "https://media.istockphoto.com/id/1225631291/photo/white-cheese-paneer-cube-food-Dairy Products-product.jpg?s=612x612&w=0&k=20&c=OTXzf134Z-4myAOlHnhS8WcG8Xde7aQ_5-oTpTvAYu0=" },
  { id: "p22", name: "Curd 500g", price: 35, category: "Dairy Products", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7MadYoqSWN1Lw0sNrGDhmY4rJxEkeyavzJA&s" },

  { id: "p23", name: "Lays Chips 100g", price: 20, category: "Instant Food", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQlg-OJSOAmzB5X_iWp-uA2hfmYqP50TfymA&s" },
  { id: "p24", name: "Kurkure 100g", price: 15, category: "Instant Food", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYDo7T7dc02X8VTxqqG9pKexf7IZTYjf8TBw&s" },
  { id: "p25", name: "Bingo Mad Angles 100g", price: 25, category: "Instant Food", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVWs12bD_1evnz1_BI4T6mPodGEk_duBiA-A&s" },

  { id: "p26", name: "Organic Cucumber 500g", price: 40, category: "Organic", image: "https://images.unsplash.com/photo-1615484477657-f27ce714b27a?q=80" },
  { id: "p27", name: "Organic Papaya 1kg", price: 60, category: "Organic", image: "https://images.unsplash.com/photo-1624078618790-5e1109079b84?q=80" },
  { id: "p28", name: "Organic Coriander Bunch", price: 15, category: "Organic", image: "https://images.unsplash.com/photo-1609868763029-7be967b3e95c?q=80" },
  { id: "p29", name: "Organic Apple 1kg", price: 150, category: "Organic", image: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?q=80" },
  { id: "p30", name: "Organic Lemon 500g", price: 35, category: "Organic", image: "https://images.unsplash.com/photo-1613145998995-9ff7c17c7a2a?q=80" },

  { id: "p31", name: "Basmati Rice 1kg", price: 90, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQryMdeghX28ezEexxURvq1sYCTEZ-l-qn7PQ&s" },
  { id: "p32", name: "Wheat Grain 1kg", price: 35, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkB5YXPEsuFUEvw8ZJE6D-_GFUSrjolD6kaw&s" },
  { id: "p33", name: "Brown Rice 1kg", price: 70, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOEUawq5lyuP4HoOfp5jIXJfPsyZ4VOLrWIA&s" },
  { id: "p34", name: "Toor Dal 1kg", price: 110, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkOJimFAe2pXGBs8kFptk_ZqIib5HWhLO8yg&s" },
  { id: "p35", name: "Moong Dal 1kg", price: 100, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxfsknWx22uWsDITbACZKkGg-Mrdji1tL5DA&s" },
  { id: "p36", name: "Chana Dal 1kg", price: 95, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLFlhV697KvBrlE26XkzAhJ5IwNhgP22xLTQ&s" },
  { id: "p37", name: "Wheat Flour 1kg", price: 45, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9x6iwGJNoprklV0Lsay8_N04Mw900h7lVLg&s" },
  { id: "p38", name: "Besan (Gram Flour) 500g", price: 38, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQgF_apNfvtm8RtddjmTIZMj6_GHQgUyWtbw&s" },
  { id: "p39", name: "Multigrain Flour 1kg", price: 60, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxzEhyXLhPF_aIFpEYVB4D2NLwon1spBNfEQ&s" },
  { id: "p40", name: "Chia Grains & Cerealss 250g", price: 140, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbHhD3TdKdrzoc8VB81zj3M0ui5QDVkY7GRg&s" },
  { id: "p41", name: "Flax Grains & Cerealss 250g", price: 110, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsUP317lDYLG6ljXfgI6INXWeQmKF4ARvl_Q&s" },
  { id: "p42", name: "Sunflower Grains & Cerealss 250g", price: 125, category: "Grains & Cereals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaYDvSJXJpgCN4ZoZgYy5kllrbLApskYUXug&s" }
];

export default allProducts;
