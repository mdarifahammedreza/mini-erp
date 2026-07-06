import mongoose from 'mongoose';

async function run() {
  await mongoose.connect('mongodb://localhost:27018/mini-erp');
  console.log('Connected to DB');
  
  const Category = mongoose.model('Category', new mongoose.Schema({ name: String }, { strict: false }));
  const categories = await Category.find();
  console.log('Found categories:', categories.length);

  const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    sku: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    purchasePrice: Number,
    sellingPrice: Number,
    stockQuantity: Number,
    image: String,
    description: String,
    isActive: Boolean
  }, { strict: false }));

  console.log('Generating 1000 products...');
  
  const newProducts = [];
  for (let i = 0; i < 1000; i++) {
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    newProducts.push({
      name: `Seeded Product ${i}`,
      sku: `SEED-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      category: randomCat ? randomCat._id : null,
      purchasePrice: 10,
      sellingPrice: 20,
      stockQuantity: Math.floor(Math.random() * 100),
      image: 'uploads/placeholder.png',
      description: 'Auto generated product',
      isActive: true,
      deletedAt: null
    });
  }

  await Product.insertMany(newProducts);
  console.log('Inserted 1000 products');

  // Let's test the category filter
  if (categories.length > 0) {
    const testCatId = categories[0]._id;
    console.log(`Testing category filter for ID: ${testCatId}`);
    const filtered = await Product.find({ category: testCatId });
    console.log(`Found ${filtered.length} products for this category`);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
