 const handleSubmitStage = async (e) => {

   e.preventDefault();
  
    if (Fetchuser.account_status !== "Active") {
    alert("Please complete your account activation to submit a stage.");
    SliderContentHandle("ED_CB_profile"); // redirect to profile
    return; // stop further execution
  }
 

  const form = e.currentTarget;
  const typeStage = form.elements["type_stage"].value.trim();
  const categorieStage = form.elements["categorie_stage"].value.trim();
  const emplacement = form.elements["emplacement"].value.trim();
  const nombrePlace = form.elements["nombre_place"].value.trim();
  const debutStage = form.elements["debut_stage"].value.trim();
  const dureeStage = form.elements["duree_semaines"].value.trim();
  const titreStage = form.elements["titre_stage"].value.trim();
  const descriptionStage = form.elements["description_stage"].value.trim();
  const competencesRequises = form.elements["competence_requise"].value.trim();


    const entreprise_id = localStorage.getItem("user_id")
  const stageInfo = {
     entreprise_id: entreprise_id,
      typeStage,
      categorieStage,
      emplacement,
      nombrePlace,
      debutStage,
      dureeStage,
      titreStage,
      descriptionStage,
      competencesRequises
  }

  console.log(stageInfo)

  // Validate form fields
  if (!typeStage || !categorieStage || !emplacement || !nombrePlace || !debutStage || !dureeStage || !titreStage || !descriptionStage || !competencesRequises) {
    return alert("All fields are required!");
  }

  try {
    const res = await fetch("http://localhost:8000/handle_stage.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        entreprise_id:  entreprise_id,
        type_stage: typeStage,
        titre_stage: titreStage,
        categorie_stage: categorieStage,
        description_stage: descriptionStage,
        competence_requise: competencesRequises,
        debut_stage: debutStage,
        duree_semaines: dureeStage,
        emplacement: emplacement,
        nombre_place: nombrePlace,
        
        
        
       // Pass entreprise_id (or fetch dynamically)
      }),
    });

    
    const data = await res.json();
    if (data.success) {
      alert("Stage added successfully!");
      // Optionally, clear the form or redirect
      setCancelAddStage(true)

      SliderContentHandler("ED_CB_Stages");


    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
};




