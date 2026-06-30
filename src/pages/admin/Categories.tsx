/*import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import CategoriesTable from "../../components/admin/CategoriesTable";
import CategoryModal from "../../components/admin/CategoryModal";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

import { toast } from "react-toastify";

=======
// src/pages/admin/Categories.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  service_count: number;
  created_at: string;
  updated_at?: string;
  status: "actif" | "inactif";
}

interface CategoryStats {
  total: number;
  actifs: number;
  inactifs: number;
  total_services: number;
}
>>>>>>> 75bcc7c9458ed707b0958676eaf2de7d2950446b

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [filterStatus, setFilterStatus] = useState("tous");
  const [sortBy, setSortBy] = useState<"name" | "services" | "date">("name");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "📂",
    color: "#4F46E5",
    status: "actif" as "actif" | "inactif"
  });


const [categories,setCategories] =
useState<any[]>([]);


const [selectedCategory,setSelectedCategory] =
useState<any>(null);


const [search,setSearch] =
useState("");


const [modalKey,setModalKey] =
useState(0);





useEffect(()=>{

 fetchCategories();

},[]);






const fetchCategories = async()=>{

try{


const data =
await getCategories();


setCategories(data);



}catch(error){


toast.error(
"Erreur chargement"
);


}

};








const handleSave =
async(formData:FormData)=>{


try{


if(selectedCategory){


await updateCategory(
selectedCategory.id,
formData
);


toast.success(
"Catégorie modifiée"
);



}else{


await createCategory(
formData
);


toast.success(
"Catégorie créée"
);


}




await fetchCategories();



// vider formulaire
setModalKey(
prev=>prev+1
);


// fermer proprement
const modalElement =
document.getElementById(
"categoryModal"
);


if(modalElement){


const button =
document.querySelector(
'[data-bs-dismiss="modal"]'
) as HTMLElement;


button?.click();


}




setSelectedCategory(null);



}catch(error){


console.log(error);


toast.error(
"Erreur"
);


}



};









const handleDelete =
async(id:number)=>{


if(!confirm(
"Supprimer cette catégorie ?"
))
return;



try{


await deleteCategory(id);



toast.success(
"Catégorie supprimée"
);



fetchCategories();



}catch(error){


toast.error(
"Erreur suppression"
);


}


};









const filteredCategories =
categories.filter(
(category:any)=>

category.nom
?.toLowerCase()
.includes(
search.toLowerCase()
)

);










return (

<DashboardLayout
sidebar={<AdminSidebar/>}
>


<div className="d-flex justify-content-between mb-4">


<h2>
Gestion Catégories
</h2>



<button

className="btn btn-primary"

data-bs-toggle="modal"

data-bs-target="#categoryModal"

onClick={()=>{

setSelectedCategory(null);

}}

>

Ajouter

</button>


</div>







<input

className="form-control mb-4"

placeholder="Rechercher..."

value={search}


onChange={
e=>setSearch(
e.target.value
)
}


/>








<CategoriesTable

categories={
filteredCategories
}


onEdit={(category)=>{

setSelectedCategory(
category
);

}}


onDelete={
handleDelete
}


/>









<CategoryModal


key={modalKey}


category={
selectedCategory
}


onSave={
handleSave
}


/>






</DashboardLayout>


);


};


export default Categories;
*/

// src/pages/admin/Categories.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  service_count: number;
  created_at: string;
  updated_at?: string;
  status: "actif" | "inactif";
}

interface CategoryStats {
  total: number;
  actifs: number;
  inactifs: number;
  total_services: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [filterStatus, setFilterStatus] = useState("tous");
  const [sortBy, setSortBy] = useState<"name" | "services" | "date">("name");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "📂",
    color: "#4F46E5",
    status: "actif" as "actif" | "inactif"
  });

  const icons = [
    "📂", "🛠️", "📚", "🎨", "💻", "🏥", "🎵", "📷", 
    "✏️", "🔧", "🧹", "🍳", "🧘", "🏋️", "🎭", "🎪",
    "🚗", "✈️", "🏠", "🌿", "💡", "📊", "🎯", "⚡"
  ];

  const colors = [
    "#4F46E5", "#7C3AED", "#EC4899", "#EF4444", "#F59E0B",
    "#10B981", "#3B82F6", "#8B5CF6", "#F472B6", "#F97316",
    "#14B8A6", "#6366F1", "#A855F7", "#22D3EE", "#34D399"
  ];

  // Initialisation des données
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem("categories");
      if (savedCategories) {
        try {
          const parsed = JSON.parse(savedCategories);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
            setFilteredCategories(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Erreur de parsing:", e);
        }
      }
      initializeDefaultCategories();
    } catch (err) {
      console.error("Erreur d'initialisation:", err);
      setError("Erreur lors du chargement des catégories");
      setLoading(false);
    }
  }, []);

  const initializeDefaultCategories = () => {
    const defaultCategories: Category[] = [
      {
        id: 1,
        name: "Éducation",
        description: "Cours particuliers, tutorat, formations et accompagnement scolaire",
        icon: "📚",
        color: "#4F46E5",
        service_count: 12,
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 10).toISOString()
      },
      {
        id: 2,
        name: "Bricolage",
        description: "Plomberie, électricité, menuiserie, peinture et réparations diverses",
        icon: "🛠️",
        color: "#F59E0B",
        service_count: 8,
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 25).toISOString()
      },
      {
        id: 3,
        name: "Bien-être",
        description: "Yoga, méditation, massages, soins énergétiques et bien-être",
        icon: "🧘",
        color: "#10B981",
        service_count: 6,
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 20).toISOString()
      },
      {
        id: 4,
        name: "Mode",
        description: "Couture, stylisme, retouches et création de vêtements sur mesure",
        icon: "🎨",
        color: "#EC4899",
        service_count: 5,
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 18).toISOString()
      },
      {
        id: 5,
        name: "Technologie",
        description: "Réparation informatique, développement web, maintenance et support technique",
        icon: "💻",
        color: "#3B82F6",
        service_count: 10,
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 15).toISOString()
      },
      {
        id: 6,
        name: "Santé",
        description: "Services de santé, soins à domicile, accompagnement médical",
        icon: "🏥",
        color: "#EF4444",
        service_count: 4,
        status: "inactif",
        created_at: new Date(Date.now() - 86400000 * 12).toISOString()
      },
      {
        id: 7,
        name: "Art",
        description: "Photographie, peinture, sculpture, arts visuels et créatifs",
        icon: "🎨",
        color: "#8B5CF6",
        service_count: 7,
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString()
      },
      {
        id: 8,
        name: "Développement",
        description: "Coaching personnel, développement professionnel et motivation",
        icon: "🎯",
        color: "#22D3EE",
        service_count: 3,
        status: "actif",
        created_at: new Date(Date.now() - 86400000 * 8).toISOString()
      }
    ];
    setCategories(defaultCategories);
    setFilteredCategories(defaultCategories);
    localStorage.setItem("categories", JSON.stringify(defaultCategories));
    setLoading(false);
  };

  // Filtrage et tri
  useEffect(() => {
    try {
      let result = [...categories];

      // Recherche
      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower)
        );
      }

      // Filtre par statut
      if (filterStatus !== "tous") {
        result = result.filter((c) => c.status === filterStatus);
      }

      // Tri
      if (sortBy === "name") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "services") {
        result.sort((a, b) => b.service_count - a.service_count);
      } else if (sortBy === "date") {
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setFilteredCategories(result);
    } catch (err) {
      console.error("Erreur de filtrage:", err);
    }
  }, [search, filterStatus, sortBy, categories]);

  // Sauvegarde automatique
  useEffect(() => {
    if (categories.length > 0) {
      try {
        localStorage.setItem("categories", JSON.stringify(categories));
      } catch (err) {
        console.error("Erreur de sauvegarde:", err);
      }
    }
  }, [categories]);

  const handleSave = () => {
    try {
      if (!formData.name.trim()) {
        showNotification("Le nom de la catégorie est requis", "error");
        return;
      }

      // Vérifier si le nom existe déjà
      const exists = categories.some(
        (c) => c.name.toLowerCase() === formData.name.toLowerCase() && 
        c.id !== selectedCategory?.id
      );
      
      if (exists) {
        showNotification("Une catégorie avec ce nom existe déjà", "error");
        return;
      }

      if (selectedCategory) {
        // Modification
        setCategories(prev =>
          prev.map(c =>
            c.id === selectedCategory.id
              ? {
                  ...c,
                  name: formData.name.trim(),
                  description: formData.description.trim(),
                  icon: formData.icon,
                  color: formData.color,
                  status: formData.status,
                  updated_at: new Date().toISOString()
                }
              : c
          )
        );
        showNotification("Catégorie modifiée avec succès", "success");
      } else {
        // Création
        const newCategory: Category = {
          id: Date.now(),
          name: formData.name.trim(),
          description: formData.description.trim(),
          icon: formData.icon,
          color: formData.color,
          service_count: 0,
          status: formData.status,
          created_at: new Date().toISOString()
        };
        setCategories(prev => [...prev, newCategory]);
        showNotification("Catégorie créée avec succès", "success");
      }

      closeModal();
    } catch (err) {
      console.error("Erreur:", err);
      showNotification("Erreur lors de l'enregistrement", "error");
    }
  };

  const handleDelete = (id: number) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;

    // Vérifier si la catégorie a des services
    if (categoryToDelete.service_count > 0) {
      if (!window.confirm(
        `Cette catégorie contient ${categoryToDelete.service_count} service(s).\n` +
        `Êtes-vous sûr de vouloir la supprimer ?`
      )) return;
    } else {
      if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryToDelete.name}" ?`)) return;
    }

    try {
      setCategories(prev => prev.filter(c => c.id !== id));
      if (selectedCategory && selectedCategory.id === id) {
        setSelectedCategory(null);
      }
      showNotification("Catégorie supprimée avec succès", "success");
    } catch (err) {
      console.error("Erreur:", err);
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  const handleToggleStatus = (id: number) => {
    try {
      setCategories(prev =>
        prev.map(c =>
          c.id === id
            ? { ...c, status: c.status === "actif" ? "inactif" : "actif" as any }
            : c
        )
      );
      showNotification("Statut de la catégorie mis à jour", "success");
    } catch (err) {
      console.error("Erreur:", err);
      showNotification("Erreur lors de la mise à jour", "error");
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
        status: category.status
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: "",
        description: "",
        icon: "📂",
        color: "#4F46E5",
        status: "actif"
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    try {
      const notification = document.createElement("div");
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        background: ${type === "success" ? "linear-gradient(135deg, #16a34a, #22c55e)" : "linear-gradient(135deg, #dc2626, #ef4444)"};
        animation: slideIn 0.3s ease;
        max-width: 400px;
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        notification.style.transition = "all 0.3s ease";
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    } catch (err) {
      console.error("Erreur de notification:", err);
    }
  };

  // Statistiques
  const stats: CategoryStats = {
    total: categories.length,
    actifs: categories.filter(c => c.status === "actif").length,
    inactifs: categories.filter(c => c.status === "inactif").length,
    total_services: categories.reduce((acc, c) => acc + c.service_count, 0)
  };

  if (error) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div style={{ padding: "24px" }}>
          <div style={{ 
            background: "#fee2e2", 
            color: "#dc2626", 
            padding: "16px 24px", 
            borderRadius: "12px",
            border: "1px solid #fecaca"
          }}>
            <h3 style={{ margin: "0 0 8px 0" }}>⚠️ Erreur</h3>
            <p style={{ margin: 0 }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "400px", 
          gap: "16px" 
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTopColor: "#4F46E5",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }}></div>
          <p>Chargement des catégories...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* En-tête */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          marginBottom: "32px", 
          flexWrap: "wrap", 
          gap: "16px" 
        }}>
          <div>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              color: "#1a202c", 
              margin: "0 0 4px 0", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px" 
            }}>
              <span style={{ fontSize: "32px" }}>📁</span>
              Gestion des Catégories
            </h1>
            <p style={{ color: "#718096", fontSize: "15px", margin: 0 }}>
              Gérez les catégories de services de la plateforme KayJob
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button 
              onClick={() => setShowStats(!showStats)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "white",
                color: "#4a5568",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <span>📊</span>
              {showStats ? "Cacher" : "Voir"} les stats
            </button>
            <button 
              onClick={() => openModal()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)"
              }}
            >
              <span>➕</span>
              Nouvelle catégorie
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {showStats && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px"
            }}>
              {[
                { label: "Total", value: stats.total, icon: "📁", color: "#eff6ff", textColor: "#3b82f6" },
                { label: "Actives", value: stats.actifs, icon: "🟢", color: "#dcfce7", textColor: "#16a34a" },
                { label: "Inactives", value: stats.inactifs, icon: "🔴", color: "#fee2e2", textColor: "#ef4444" },
                { label: "Total services", value: stats.total_services, icon: "📦", color: "#fef3c7", textColor: "#d97706" }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 20px",
                  background: stat.color,
                  borderRadius: "12px"
                }}>
                  <div style={{
                    fontSize: "24px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                    borderRadius: "10px"
                  }}>{stat.icon}</div>
                  <div>
                    <h3 style={{ fontSize: "22px", fontWeight: "700", margin: 0, color: stat.textColor }}>
                      {stat.value}
                    </h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtres */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          border: "1px solid #f1f5f9",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center"
        }}>
          <div style={{
            flex: 1,
            minWidth: "200px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f8fafc",
            padding: "0 16px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                background: "none",
                outline: "none",
                fontSize: "14px"
              }}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#a0aec0",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "10px 16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              minWidth: "140px"
            }}
          >
            <option value="tous">📊 Tous statuts</option>
            <option value="actif">🟢 Actives</option>
            <option value="inactif">🔴 Inactives</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: "10px 16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              minWidth: "140px"
            }}
          >
            <option value="name">🔤 Par nom</option>
            <option value="services">📦 Par services</option>
            <option value="date">📅 Plus récentes</option>
          </select>
        </div>

        {/* Résultats */}
        <div style={{ fontSize: "14px", color: "#718096", marginBottom: "16px" }}>
          <span>
            {filteredCategories.length} catégorie{filteredCategories.length > 1 ? "s" : ""} trouvée{filteredCategories.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Liste des catégories */}
        {filteredCategories.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "48px 20px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9"
          }}>
            <span style={{ fontSize: "48px", opacity: "0.5" }}>📭</span>
            <p style={{ fontSize: "16px", fontWeight: "500", margin: "8px 0 4px 0", color: "#475569" }}>
              Aucune catégorie trouvée
            </p>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>
              {search ? "Essayez avec d'autres critères" : "Ajoutez votre première catégorie"}
            </span>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            {filteredCategories.map((category) => (
              <div key={category.id} style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: "1px solid #f1f5f9",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
              }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: category.color,
                    borderRadius: "14px",
                    fontSize: "28px",
                    flexShrink: 0
                  }}>
                    {category.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: "18px", 
                      fontWeight: "700", 
                      color: "#1a202c",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      {category.name}
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "10px",
                        fontWeight: "600",
                        background: category.status === "actif" ? "#dcfce7" : "#fee2e2",
                        color: category.status === "actif" ? "#16a34a" : "#ef4444"
                      }}>
                        {category.status === "actif" ? "🟢 Actif" : "🔴 Inactif"}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: "13px", 
                      color: "#718096",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <span>📦 {category.service_count} service{category.service_count > 1 ? "s" : ""}</span>
                      <span>📅 {formatDate(category.created_at)}</span>
                    </div>
                  </div>
                </div>

                <p style={{
                  color: "#475569",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  margin: "0 0 16px 0",
                  flex: 1
                }}>
                  {category.description}
                </p>

                <div style={{
                  display: "flex",
                  gap: "8px",
                  paddingTop: "12px",
                  borderTop: "1px solid #f1f5f9",
                  justifyContent: "flex-end"
                }}>
                  <button
                    onClick={() => openModal(category)}
                    style={{
                      padding: "6px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#eef2ff",
                      color: "#4F46E5",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleToggleStatus(category.id)}
                    style={{
                      padding: "6px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: category.status === "actif" ? "#fef3c7" : "#dcfce7",
                      color: category.status === "actif" ? "#d97706" : "#16a34a",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {category.status === "actif" ? "⏸️ Désactiver" : "▶️ Activer"}
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    style={{
                      padding: "6px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#fee2e2",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Ajout/Modification */}
        {showModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }} onClick={closeModal}>
            <div style={{
              background: "white",
              borderRadius: "20px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto"
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px 32px",
                borderBottom: "1px solid #f1f5f9"
              }}>
                <h2 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1a202c",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "24px" }}>
                    {selectedCategory ? "✏️" : "➕"}
                  </span>
                  {selectedCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
                </h2>
                <button 
                  onClick={closeModal}
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "none",
                    background: "#f1f5f9",
                    borderRadius: "50%",
                    fontSize: "18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b"
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: "32px" }}>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "16px" 
                }}>
                  <div>
                    <label style={{ 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      color: "#334155",
                      display: "block",
                      marginBottom: "6px"
                    }}>
                      Nom de la catégorie <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Éducation, Bricolage..."
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      color: "#334155",
                      display: "block",
                      marginBottom: "6px"
                    }}>
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Décrivez cette catégorie..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        resize: "vertical",
                        transition: "all 0.3s ease",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      color: "#334155",
                      display: "block",
                      marginBottom: "6px"
                    }}>
                      Icône
                    </label>
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      padding: "12px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "2px solid #e2e8f0"
                    }}>
                      {icons.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setFormData({ ...formData, icon })}
                          style={{
                            width: "40px",
                            height: "40px",
                            border: icon === formData.icon ? "2px solid #4F46E5" : "2px solid transparent",
                            borderRadius: "8px",
                            background: icon === formData.icon ? "#eef2ff" : "white",
                            cursor: "pointer",
                            fontSize: "20px",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      color: "#334155",
                      display: "block",
                      marginBottom: "6px"
                    }}>
                      Couleur
                    </label>
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      padding: "12px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "2px solid #e2e8f0"
                    }}>
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setFormData({ ...formData, color })}
                          style={{
                            width: "36px",
                            height: "36px",
                            border: color === formData.color ? "3px solid #1a202c" : "2px solid transparent",
                            borderRadius: "50%",
                            background: color,
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      color: "#334155",
                      display: "block",
                      marginBottom: "6px"
                    }}>
                      Statut
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "actif" | "inactif" })}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "14px",
                        background: "white",
                        cursor: "pointer",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    >
                      <option value="actif">🟢 Actif</option>
                      <option value="inactif">🔴 Inactif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                padding: "20px 32px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafbfc",
                borderRadius: "0 0 20px 20px"
              }}>
                <button 
                  onClick={closeModal}
                  style={{
                    padding: "10px 24px",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#475569",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSave}
                  style={{
                    padding: "10px 24px",
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span>💾</span>
                  {selectedCategory ? "Mettre à jour" : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Categories;