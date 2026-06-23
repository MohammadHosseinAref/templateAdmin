import type { Scene, TablesData } from './data';

export interface FloorViewerProps {
  scene: Scene;
  allScenes: Scene[];
  panoramaEnabled: boolean;
  onChange: (scene: Scene) => void;
  onNavigate: (sceneId: string) => void;
  onPanoramaToggle: (v: boolean) => void;
  onSave: () => void;
  saved: boolean;
}

export interface TablesListProps {
  scene: Scene;
  onChange: (scene: Scene) => void;
  onSave: () => void;
  saved: boolean;
}

export interface TablesSettingsProps {
  data: TablesData;
  onChange: (data: TablesData) => void;
  onSave: () => void;
  saved: boolean;
}
