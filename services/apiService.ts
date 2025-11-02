import type { PlayerState } from '../types.ts';

/**
 * Serializes the player state to a JSON file and triggers a download.
 * @param playerState The current player state object.
 */
export const exportPlayerState = (playerState: PlayerState): void => {
  try {
    const dataStr = JSON.stringify(playerState, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sage_path_full_progress.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting player state:", error);
    alert("Failed to export progress. See console for details.");
  }
};

/**
 * Opens a file picker for the user to select a JSON file, then parses it into a PlayerState object.
 * @returns A promise that resolves to the imported PlayerState or null if the process is cancelled or fails.
 */
export const importPlayerState = (showToast: (message: string, type: 'success' | 'error') => void): Promise<PlayerState | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string') {
            const parsedState: PlayerState = JSON.parse(result);
            // Basic validation to ensure it's a valid state file
            if (parsedState && typeof parsedState.level === 'number' && Array.isArray(parsedState.missions)) {
              showToast("Progress successfully imported!", 'success');
              resolve(parsedState);
            } else {
              throw new Error("Invalid save file format.");
            }
          }
        } catch (error) {
          console.error("Error importing player state:", error);
          showToast("Failed to import progress. The file may be invalid or corrupted.", 'error');
          resolve(null);
        }
      };

      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        showToast("An error occurred while reading the file.", 'error');
        resolve(null);
      }

      reader.readAsText(file);
    };
    
    input.click();
  });
};