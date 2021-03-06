﻿using Abp.Domain.Entities;
using System.Collections.Generic;

namespace WatchWord.Entities
{
    /// <summary>Nested type of scan result.</summary>
    public class ScanResult : Entity<long>
    {
        /// <summary>Gets or sets unsorted collection of words in the file.</summary>
        public List<Word> Words { get; set; }

        /// <summary>Gets or sets unsorted collection of word compositions in the file.</summary>
        public List<Composition> Compositions { get; set; }
    }
}
