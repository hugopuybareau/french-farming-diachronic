import type { RA2020Data, RegionData, DepartmentData, SizeFilter, Indicator, SauClass } from '@/types/data';

export const getValueForArea = (
  area: RegionData | DepartmentData,
  indicator: Indicator,
  sizeFilter: SizeFilter
): number => {
  if (sizeFilter === 'all') {
    return area.total[indicator];
  }
  
  const classData = area.by_class[sizeFilter as SauClass];
  return classData ? classData[indicator] : 0;
};

export const getDataRange = (
  data: RA2020Data,
  level: 'regions' | 'departments',
  indicator: Indicator,
  sizeFilter: SizeFilter
): [number, number] => {
  const areas = level === 'regions' ? data.regions : data.departments;
  
  const values = areas.map(area => getValueForArea(area, indicator, sizeFilter));
  const validValues = values.filter(v => v > 0);
  
  if (validValues.length === 0) return [0, 1];
  
  return [Math.min(...validValues), Math.max(...validValues)];
};

export const calculateStats = (
  data: RA2020Data,
  level: 'regions' | 'departments',
  indicator: Indicator,
  sizeFilter: SizeFilter
) => {
  const areas = level === 'regions' ? data.regions : data.departments;
  
  const values = areas.map(area => ({
    name: 'name' in area ? area.name : area.code,
    value: getValueForArea(area, indicator, sizeFilter)
  })).filter(v => v.value > 0);
  
  if (values.length === 0) {
    return {
      total: 0,
      average: 0,
      min: { name: '-', value: 0 },
      max: { name: '-', value: 0 },
      count: 0
    };
  }
  
  const total = values.reduce((sum, v) => sum + v.value, 0);
  const average = total / values.length;
  const sorted = [...values].sort((a, b) => a.value - b.value);
  
  return {
    total,
    average,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    count: values.length
  };
};

// Mapping from region code to region name for departments
export const getRegionForDepartment = (
  data: RA2020Data,
  deptCode: string
): RegionData | undefined => {
  const dept = data.departments.find(d => d.code === deptCode);
  if (!dept) return undefined;
  
  return data.regions.find(r => r.name === dept.region_name);
};

export const getDepartmentsForRegion = (
  data: RA2020Data,
  regionName: string
): DepartmentData[] => {
  return data.departments.filter(d => d.region_name === regionName);
};
