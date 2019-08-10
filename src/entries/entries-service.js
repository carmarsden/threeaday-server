const xss = require('xss');

const EntriesService = {
    getById(db, id) {
        return db
            .from('threeaday_entries AS ent')
            .select('*')
            .where('ent.id', id)
            .first()
        ;
    },

    getByUser(db, user_id) {
        return db
            .from('threeaday_entries AS ent')
            .select('*')
            .where('ent.user_id', user_id)
        ;
    },

    getSomePublic(db, howMany) {
        return db
            .from('threeaday_entries AS ent')
            .select('*')
            .where('ent.public', true)
            .orderBy('ent.date_modified', 'desc')
            .limit(howMany)
        ;
    },

    insertEntry(db, newEntry) {
        return db
            .insert(newEntry)
            .into('threeaday_entries')
            .returning('*')
            .then(([entry]) => entry)
            .then(entry => EntriesService.getById(db, entry.id))
        ;
    },

    serializeEntry(entry) {
        return {
            id: entry.id,
            content: xss(entry.content),
            public: entry.public,
            user_id: entry.user_id,
            date_modified: entry.date_modified,
            tag_amusement: entry.tag_amusement,
            tag_awe: entry.tag_awe,
            tag_contentment: entry.tag_contentment,
            tag_gratitude: entry.tag_gratitude,
            tag_inspiration: entry.tag_inspiration,
            tag_joy: entry.tag_joy,
            tag_hope: entry.tag_hope,
            tag_love: entry.tag_love,
            tag_pride: entry.tag_pride,
            tag_serenity: entry.tag_serenity,
            tag_other: xss(entry.tag_other),
        }
    },
    serializeEntries(entries) {
        return entries.map(this.serializeEntry)
    },
}

module.exports = EntriesService;