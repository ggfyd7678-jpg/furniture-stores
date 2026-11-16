const WHATSAPP = "201066004447";

// جلب المنتجات المخزنة مسبقاً من المتصفح أو البدء بقائمة فارغة إذا لمط تكن موجودة
let products = JSON.parse(localStorage.getItem("fabrics_products")) || [];

const grid = document.getElementById("productGrid");

// دالة لحفظ المنتجات في الـ LocalStorage
function saveProductsToLocalStorage() {
    localStorage.setItem("fabrics_products", JSON.stringify(products));
}

function showProducts(list) {
    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1; color: #777;'>لا توجد منتجات مضافة حالياً. قم بإضافة منتجك الأول بالأسفل!</p>";
        return;
    }

    list.forEach((product, index) => {
        let card = document.createElement("div");
        card.className = "card";

        let img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;

        let name = document.createElement("h3");
        name.textContent = product.name;

        let desc = document.createElement("p");
        desc.textContent = product.desc || "";

        let price = document.createElement("p");
        price.className = "price";
        price.textContent = product.price + " جنيه";

        // زر الحذف (اختياري، يظهر تحت المنتج لتتمكن من حذف أي منتج أضفته بالخطأ)
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "حذف المنتج";
        deleteBtn.style.cssText = "background: #c0392b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-bottom: 8px; font-size: 13px;";
        deleteBtn.onclick = function() {
            deleteProduct(index);
        };

        let order = document.createElement("a");
        order.className = "order";
        order.target = "_blank";

        let message = encodeURIComponent(
            "أريد طلب " + product.name +
            " بسعر " + product.price + " جنيه"
        );

        order.href = "https://wa.me/" +
            WHATSAPP + "?text=" + message;

        order.textContent = "اطلب الآن";

        card.append(img, name, desc, price, deleteBtn, order);
        grid.appendChild(card);
    });
}

// عرض القائمة عند التحميل
showProducts(products);

// دالة لحذف منتج معين وتحديث التخزين
function deleteProduct(index) {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
        products.splice(index, 1);
        saveProductsToLocalStorage();
        showProducts(products);
    }
}

// البحث عن المنتجات
document.getElementById("search")
.addEventListener("input", function() {
    let value = this.value.toLowerCase();
    let result = products.filter(product =>
        product.name.toLowerCase().includes(value)
    );
    showProducts(result);
});

// إضافة منتج جديد
document.getElementById("productForm")
.addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let desc = document.getElementById("productDesc").value;
    let file = document.getElementById("productImage").files[0];

    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
        alert("imge./m25 كبير.jpeg");
        return;
    }

    let reader = new FileReader();

    reader.onload = function() {
        products.push({
            name: name,
            price: Number(price),
            desc: desc,
            image: reader.result
        });

        // حفظ القائمة الجديدة في التخزين المحلي
        saveProductsToLocalStorage();

        showProducts(products);
        alert("تم إضافة المنتج بنجاح!");
        document.getElementById("productForm").reset();
    };

    reader.readAsDataURL(file);
});