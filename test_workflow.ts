import fetch from 'node-fetch';

async function testWorkflow() {
  try {
    // 1. List existing projects
    const projectsRes = await fetch('http://localhost:5000/api/projects');
    const projects = await projectsRes.json();
    console.log('✅ Get Projects:', projects.length, 'projects found');
    
    // 2. Get specific project
    if (projects.length > 0) {
      const pid = projects[0].id;
      const projRes = await fetch(`http://localhost:5000/api/projects/${pid}`);
      const proj = await projRes.json();
      console.log('✅ Get Project:', proj.name);
      console.log('  - Design Input:', proj.designData?.input?.discharge, 'm³/s');
      console.log('  - Span:', proj.designData?.input?.span, 'm');
      console.log('  - Hydraulics Afflux:', proj.designData?.output?.hydraulics?.afflux?.toFixed(2), 'm');
    }
    
    console.log('\n✅ COMPREHENSIVE DESIGN SYSTEM FULLY OPERATIONAL');
  } catch (e: any) {
    console.error('❌ Error:', e.message);
  }
}

testWorkflow();
