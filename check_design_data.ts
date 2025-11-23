import fetch from 'isomorphic-fetch';

const project = await fetch('http://localhost:5000/api/projects/22').then(r => r.json());
const design = project.designData.output;

console.log('\n════ ACTUAL DESIGN DATA IN DATABASE ════\n');
console.log('Pier stress points:', design.pier.stressDistribution?.length || 0);
console.log('Abutment stress points:', design.abutment.stressDistribution?.length || 0);
console.log('Pier load cases:', design.pier.loadCases?.length || 0);
console.log('Abutment load cases:', design.abutment.loadCases?.length || 0);

if (design.pier.stressDistribution && design.pier.stressDistribution.length > 0) {
  console.log('\nFirst 3 Pier Stress Points:');
  design.pier.stressDistribution.slice(0, 3).forEach((sp: any, i: number) => {
    console.log(`  ${i+1}. ${sp.location} - Long: ${sp.longitudinalStress.toFixed(2)}, Trans: ${sp.transverseStress.toFixed(2)}`);
  });
}

