
const DB_NAME = 'safeserve_db';

const getInitialData = () => ({
    audits: [],
    locations: [
        { id: 'LOC-001', name: 'Bistro del Centro', lastInspectionDate: '2024-05-15', currentRiskScore: 78, openViolations: 4, manager: 'Alex Rivera', address: 'Calle Mayor 123', status: 'FLAGGED', x: 45, y: 30 },
        { id: 'LOC-002', name: 'Airport Express', lastInspectionDate: '2024-05-20', currentRiskScore: 12, openViolations: 0, manager: 'Sara Chen', address: 'Terminal 4', status: 'ACTIVE', x: 80, y: 15 },
        { id: 'LOC-003', name: 'Parrilla del Puerto', lastInspectionDate: '2024-05-10', currentRiskScore: 45, openViolations: 2, manager: 'Marcos Thompson', address: 'Muelle 39', status: 'ACTIVE', x: 20, y: 70 },
        { id: 'LOC-004', name: 'Pizzería Urbana', lastInspectionDate: '2024-05-18', currentRiskScore: 89, openViolations: 7, manager: 'Lisa G.', address: 'Av. Las Palmeras 88', status: 'FLAGGED', x: 65, y: 60 },
    ]
});

export const db = {
    get: () => {
        const data = localStorage.getItem(DB_NAME);
        if (!data) {
            const initial = getInitialData();
            localStorage.setItem(DB_NAME, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(data);
    },

    save: (data: any) => {
        localStorage.setItem(DB_NAME, JSON.stringify(data));
    },

    insertAudit: (audit: any) => {
        const state = db.get();
        state.audits.unshift(audit);
        const loc = state.locations.find((l: any) => l.id === audit.locationId);
        if (loc) {
            loc.lastInspectionDate = audit.date;
            loc.currentRiskScore = 100 - audit.progress;
            loc.openViolations = audit.violationsCount;
        }
        db.save(state);
    }
};
